import { BUO, Objeto, Pessoa, IntegranteGuarnicao } from "../types/buo";
import { formatDateFile } from "../utils/date";

export const STORAGE_KEY = "buo_app_data";
const LEGACY_KEY = "buo_system_data_v1";

export interface AppData {
  buos: BUO[];
  config: Record<string, unknown>;
}

function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function nextNumeroBuo(existing: BUO[]): string {
  const year = new Date().getFullYear();
  const count = existing.length + 1;
  return `${year}${String(count).padStart(5, "0")}`;
}

function emptyData(): AppData {
  return { buos: [], config: {} };
}

function migrateLegacy(): AppData | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { buos: parsed as BUO[], config: {} };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function getAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      if (parsed && Array.isArray(parsed.buos)) {
        return { buos: parsed.buos, config: parsed.config ?? {} };
      }
    }
    const legacy = migrateLegacy();
    if (legacy) {
      setAppData(legacy);
      localStorage.removeItem(LEGACY_KEY);
      return legacy;
    }
  } catch {
    /* ignore */
  }
  return emptyData();
}

export function setAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getBUOs(): BUO[] {
  return getAppData().buos;
}

export function getBUO(id: string): BUO | undefined {
  return getBUOs().find((b) => b.id === id);
}

export function newPessoa(): Pessoa {
  return {
    id: uid(),
    nome: "",
    idade: "",
    rg: "",
    endereco: "",
    situacao: "",
    destino: "",
    observacoes: "",
  };
}

export function newObjeto(): Objeto {
  return {
    id: uid(),
    categoria: "GERAL",
    tipo: "",
    descricao: "",
    quantidade: "1",
    unidade: "UN",
    numeroIdentificacao: "",
    situacao: "",
    observacoes: "",
    calibre: "",
    municoes: "",
    marca: "",
    modelo: "",
    numeroSerie: "",
    tipoApreensao: "",
    substancia: "",
    embalagem: "",
    placa: "",
    chassi: "",
    cor: "",
  };
}

export function newIntegrante(): IntegranteGuarnicao {
  return { id: uid(), nome: "", ci: "", funcao: "" };
}

export function createBUO(): BUO {
  const data = getAppData();
  const now = new Date().toISOString();
  const buo: BUO = {
    id: uid(),
    numeroBuo: nextNumeroBuo(data.buos),
    data: now.split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
    tipoOcorrencia: "",
    codigoOcorrencia: "",
    localOcorrencia: "",
    municipio: "",
    bairro: "",
    zona: "",
    pelotao: "",
    equipe: "",
    vtrMt: "",
    registroCiops: "",
    situacao: "",
    tco: false,
    flagrante: false,
    apresentacaoPessoas: false,
    veiculoRecuperado: false,
    auxilioPrestado: false,
    outros: false,
    pessoas: [],
    objetos: [],
    relato: "",
    codigosOcorrencia: [],
    guarnicao: [],
    policial: { nome: "", identificacaoFuncional: "", funcao: "", observacoes: "" },
    recibo: { nome: "", funcao: "", assinatura: "", assinaturaUrl: "", assinaturaImagem: "", data: "", hora: "", observacao: "" },
    observacoes: "",
    status: "RASCUNHO",
    createdAt: now,
    updatedAt: now,
    versao: 1,
  };
  data.buos = [buo, ...data.buos];
  setAppData(data);
  return buo;
}

export function saveBUO(buo: BUO): BUO {
  const data = getAppData();
  const updated: BUO = { ...buo, updatedAt: new Date().toISOString() };
  const idx = data.buos.findIndex((b) => b.id === buo.id);
  if (idx >= 0) {
    data.buos[idx] = updated;
  } else {
    data.buos = [updated, ...data.buos];
  }
  setAppData(data);
  return updated;
}

export function updateBUO(buo: BUO): BUO {
  return saveBUO(buo);
}

export function deleteBUO(id: string): boolean {
  const data = getAppData();
  const before = data.buos.length;
  data.buos = data.buos.filter((b) => b.id !== id);
  setAppData(data);
  return data.buos.length < before;
}

export function clearAllBUOs(): void {
  const data = getAppData();
  data.buos = [];
  setAppData(data);
}

export function finalizeBUO(id: string): BUO | undefined {
  const buo = getBUO(id);
  if (!buo) return undefined;
  return saveBUO({
    ...buo,
    status: "FINALIZADO",
    finalizadoEm: new Date().toISOString(),
    finalizadoPor: "Operador local",
  });
}

export function markPdfGerado(id: string): BUO | undefined {
  const buo = getBUO(id);
  if (!buo) return undefined;
  return saveBUO({
    ...buo,
    status: "PDF_GERADO",
    pdfGeradoEm: new Date().toISOString(),
  });
}

export function duplicateBUO(id: string): BUO | null {
  const orig = getBUO(id);
  if (!orig) return null;
  const data = getAppData();
  const now = new Date().toISOString();
  const dup: BUO = {
    ...structuredClone(orig),
    id: uid(),
    numeroBuo: nextNumeroBuo(data.buos),
    data: now.split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
    status: "RASCUNHO",
    createdAt: now,
    updatedAt: now,
    finalizadoEm: undefined,
    finalizadoPor: undefined,
    pdfGeradoEm: undefined,
    hash: undefined,
    versao: 1,
  };
  data.buos = [dup, ...data.buos];
  setAppData(data);
  return dup;
}

export function exportBackup(): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    ...getAppData(),
  };
  return JSON.stringify(payload, null, 2);
}

export function downloadBackup(): void {
  const json = exportBackup();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `BUO_BACKUP_${formatDateFile()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(
  jsonText: string,
  mode: "merge" | "replace" = "merge",
): { imported: number; total: number } {
  const parsed = JSON.parse(jsonText) as Partial<AppData> & { buos?: BUO[] };
  if (!parsed || !Array.isArray(parsed.buos)) {
    throw new Error("Arquivo inválido: esperado um JSON com a lista de BUOs.");
  }

  const incoming = parsed.buos;
  const current = getAppData();

  if (mode === "replace") {
    setAppData({
      buos: incoming,
      config: { ...(current.config ?? {}), ...(parsed.config ?? {}) },
    });
    return { imported: incoming.length, total: incoming.length };
  }

  const map = new Map<string, BUO>();
  for (const b of current.buos) map.set(b.id, b);
  for (const b of incoming) map.set(b.id, b);

  const merged = Array.from(map.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  setAppData({
    buos: merged,
    config: { ...(current.config ?? {}), ...(parsed.config ?? {}) },
  });
  return { imported: incoming.length, total: merged.length };
}
