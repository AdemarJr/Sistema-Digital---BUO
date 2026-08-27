import { BUO } from "../types/buo";

export function validateBUO(buo: BUO): string[] {
  const errors: string[] = [];
  if (!buo.data) errors.push("Data da ocorrência");
  if (!buo.hora) errors.push("Hora da ocorrência");
  if (!buo.tipoOcorrencia) errors.push("Tipo de ocorrência");
  if (!buo.localOcorrencia?.trim()) errors.push("Local da ocorrência");
  if (!buo.relato?.trim()) errors.push("Relato da ocorrência");
  if (!buo.policial?.nome?.trim()) errors.push("Nome do policial responsável");
  if (!buo.policial?.identificacaoFuncional?.trim()) {
    errors.push("Nº identificação funcional");
  }
  return errors;
}
