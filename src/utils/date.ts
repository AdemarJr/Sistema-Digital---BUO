export function formatDateBR(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function formatTimeBR(isoOrTime: string): string {
  if (!isoOrTime) return "—";
  if (isoOrTime.includes("T")) {
    return new Date(isoOrTime).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return isoOrTime.slice(0, 5);
}

export function formatDateFile(iso?: string): string {
  const d = iso ? new Date(iso.includes("T") ? iso : `${iso}T12:00:00`) : new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function nowTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

export function splitDateParts(iso: string): { dia: string; mes: string; ano: string } {
  if (!iso || !iso.includes("-")) return { dia: "", mes: "", ano: "" };
  const [ano, mes, dia] = iso.split("-");
  return { dia: dia ?? "", mes: mes ?? "", ano: ano ?? "" };
}
