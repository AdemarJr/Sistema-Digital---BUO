import { BUO, CodigoOcorrencia } from "../types/buo";
import { CODIGOS_OCORRENCIA } from "../data/codes";

export function normalizeCodigoOcorrencia(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return value.trim();
  return digits.padStart(3, "0");
}

export function parseCodigosFromText(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[,;]+/)
        .map((part) => part.trim())
        .filter(Boolean)
        .map(normalizeCodigoOcorrencia)
        .filter(Boolean),
    ),
  ];
}

export function collectCodigosFromBuo(
  buo: Pick<BUO, "codigoOcorrencia" | "codigosOcorrencia">,
): string[] {
  const fromArray = (buo.codigosOcorrencia ?? [])
    .map(normalizeCodigoOcorrencia)
    .filter(Boolean);
  const fromText = parseCodigosFromText(buo.codigoOcorrencia ?? "");
  return [...new Set([...fromArray, ...fromText])];
}

export function findCodigoNoCatalogo(
  codigo: string,
  catalog: CodigoOcorrencia[] = CODIGOS_OCORRENCIA,
): CodigoOcorrencia | undefined {
  const normalized = normalizeCodigoOcorrencia(codigo);
  return catalog.find((c) => c.codigo === normalized || c.codigo === codigo.trim());
}

export function resolveCodigosCatalog(
  codes: string[],
  catalog: CodigoOcorrencia[] = CODIGOS_OCORRENCIA,
): CodigoOcorrencia[] {
  const seen = new Set<string>();
  const resolved: CodigoOcorrencia[] = [];

  for (const cod of codes) {
    const item = findCodigoNoCatalogo(cod, catalog);
    if (item && !seen.has(item.codigo)) {
      seen.add(item.codigo);
      resolved.push(item);
    }
  }

  return resolved;
}

export function formatCodigosNumeros(
  buo: Pick<BUO, "codigoOcorrencia" | "codigosOcorrencia">,
): string {
  return collectCodigosFromBuo(buo).join(", ");
}

export function formatCodigosDetalhe(
  buo: Pick<BUO, "codigoOcorrencia" | "codigosOcorrencia">,
  catalog: CodigoOcorrencia[] = CODIGOS_OCORRENCIA,
): string {
  const codes = collectCodigosFromBuo(buo);
  if (codes.length === 0) return "";

  const resolved = resolveCodigosCatalog(codes, catalog);
  const resolvedCodes = new Set(resolved.map((c) => c.codigo));

  const parts = [
    ...resolved.map((c) => `${c.codigo} — ${c.descricao}`),
    ...codes.filter((c) => !resolvedCodes.has(normalizeCodigoOcorrencia(c))),
  ];

  return parts.join(" · ");
}

export function syncCodigosFromText(codigoOcorrencia: string): {
  codigoOcorrencia: string;
  codigosOcorrencia: string[];
} {
  const codigosOcorrencia = parseCodigosFromText(codigoOcorrencia);
  return {
    codigoOcorrencia,
    codigosOcorrencia,
  };
}

export function syncCodigosFromSelection(codigosOcorrencia: string[]): {
  codigoOcorrencia: string;
  codigosOcorrencia: string[];
} {
  const normalized = codigosOcorrencia.map(normalizeCodigoOcorrencia).filter(Boolean);
  return {
    codigosOcorrencia: normalized,
    codigoOcorrencia: normalized.join(", "),
  };
}
