import { createRoot } from "react-dom/client";
import { createElement } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { BUO } from "../types/buo";
import BUOPDFTemplate from "../pdf/BUOPDFTemplate";
import { formatDateFile } from "../utils/date";
import { safeFilenamePart } from "../utils/formatters";
import { getBuoLogos } from "../utils/logos";
import "../pdf/BUOPDFTemplate.css";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

function buildFilename(buo: BUO): string {
  const shortId = safeFilenamePart(buo.id).slice(0, 8);
  return `BUO_${formatDateFile(buo.data)}_${shortId}.pdf`;
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
          if (typeof img.decode === "function") {
            img.decode().then(() => resolve()).catch(() => resolve());
          }
        }),
    ),
  );
}

async function renderTemplateOffscreen(buo: BUO): Promise<HTMLElement> {
  const logos = await getBuoLogos();

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.width = "210mm";
  host.style.background = "#fff";
  host.style.zIndex = "-1";
  host.setAttribute("aria-hidden", "true");
  document.body.appendChild(host);

  const root = createRoot(host);
  await new Promise<void>((resolve) => {
    root.render(createElement(BUOPDFTemplate, { buo, logos }));
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  await new Promise((r) => setTimeout(r, 100));
  const el = host.querySelector(".buo-pdf") as HTMLElement | null;
  if (!el) {
    root.unmount();
    document.body.removeChild(host);
    throw new Error("Falha ao renderizar o template do PDF.");
  }

  await waitForImages(el);
  await new Promise((r) => setTimeout(r, 150));

  (host as any).__buoRoot = root;
  return host;
}

function cleanupHost(host: HTMLElement) {
  const root = (host as any).__buoRoot;
  try {
    root?.unmount?.();
  } catch {
    /* ignore */
  }
  if (host.parentNode) host.parentNode.removeChild(host);
}

/** Adiciona uma página HTML ao PDF; se for mais alta que A4, fatia em páginas. */
function addCanvasToPdf(pdf: jsPDF, canvas: HTMLCanvasElement, isFirst: boolean) {
  const imgWidth = A4_WIDTH_MM;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  if (imgHeight <= A4_HEIGHT_MM + 0.5) {
    if (!isFirst) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    return;
  }

  // Conteúdo mais alto que A4: fatia verticalmente
  let heightLeft = imgHeight;
  let position = 0;
  let firstSlice = true;

  while (heightLeft > 1) {
    if (!(isFirst && firstSlice)) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= A4_HEIGHT_MM;
    position -= A4_HEIGHT_MM;
    firstSlice = false;
  }
}

export async function generateBUOPDF(
  buo: BUO,
): Promise<{ blob: Blob; filename: string; url: string }> {
  const host = await renderTemplateOffscreen(buo);
  const pages = Array.from(host.querySelectorAll(".buo-page")) as HTMLElement[];

  try {
    if (pages.length === 0) {
      throw new Error("Nenhuma página do BUO foi renderizada.");
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: page.scrollWidth,
        height: page.scrollHeight,
        windowWidth: page.scrollWidth,
        windowHeight: page.scrollHeight,
      });

      addCanvasToPdf(pdf, canvas, i === 0);
    }

    const blob = pdf.output("blob");
    const filename = buildFilename(buo);
    const url = URL.createObjectURL(blob);
    return { blob, filename, url };
  } finally {
    cleanupHost(host);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function openBlobInNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function printBlobUrl(url: string) {
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) return;
  const tryPrint = () => {
    try {
      w.focus();
      w.print();
    } catch {
      /* ignore */
    }
  };
  w.addEventListener("load", () => setTimeout(tryPrint, 400));
  setTimeout(tryPrint, 1200);
}
