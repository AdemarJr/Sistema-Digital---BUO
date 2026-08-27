import { Objeto } from "../types/buo";

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    RASCUNHO: "Rascunho",
    EM_PREENCHIMENTO: "Em preenchimento",
    FINALIZADO: "Finalizado",
    PDF_GERADO: "PDF gerado",
    ARQUIVADO: "Arquivado",
  };
  return map[status] ?? status;
}

export function objetoComplementares(o: Objeto): string {
  if (o.categoria === "ARMAMENTO") {
    return [
      o.calibre && `Calibre: ${o.calibre}`,
      o.municoes && `Munições: ${o.municoes}`,
      o.marca && `Marca: ${o.marca}`,
      o.modelo && `Modelo: ${o.modelo}`,
      o.numeroSerie && `Nº Série: ${o.numeroSerie}`,
    ]
      .filter(Boolean)
      .join(" · ");
  }
  if (o.categoria === "ENTORPECENTE") {
    return [
      o.substancia && `Substância: ${o.substancia}`,
      o.embalagem && `Embalagem: ${o.embalagem}`,
      o.unidade && `Unidade: ${o.unidade}`,
    ]
      .filter(Boolean)
      .join(" · ");
  }
  if (o.categoria === "VEICULO") {
    return [
      o.marca && `Marca: ${o.marca}`,
      o.modelo && `Modelo: ${o.modelo}`,
      o.placa && `Placa: ${o.placa}`,
      o.chassi && `Chassi: ${o.chassi}`,
      o.cor && `Cor: ${o.cor}`,
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return [
    o.numeroIdentificacao && `ID: ${o.numeroIdentificacao}`,
    o.unidade && `Unidade: ${o.unidade}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function safeFilenamePart(value: string): string {
  return (value || "SEM_NUMERO").replace(/[^\w\-]+/g, "_");
}
