export const TIPOS_ENTORPECENTE = [
  'ESTIMULANTES',
  'DEPRESSORES',
  'ALUCINÓGENOS',
] as const;

export type TipoEntorpecente = (typeof TIPOS_ENTORPECENTE)[number];

export const SUBSTANCIAS_POR_TIPO: Record<TipoEntorpecente, readonly string[]> = {
  ESTIMULANTES: [
    'Cocaína/Crack',
    'Anfetamina/Metanfetamina',
    'Ecstasy (MDMA)',
  ],
  DEPRESSORES: [
    'Heróina/Ópio',
    'Inalantes/Solventes',
  ],
  ALUCINÓGENOS: [
    'Maconha/Skank',
    'LSD',
    'Chá de cogumelo',
  ],
};

export const TIPOS_APREENSAO_ENTORPECENTE = [
  'Apreensão por Tráfico de Drogas',
  'Apreensão para Consumo Pessoal',
] as const;

export function isTipoEntorpecente(value: string): value is TipoEntorpecente {
  return (TIPOS_ENTORPECENTE as readonly string[]).includes(value);
}
