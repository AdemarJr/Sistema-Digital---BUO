export type SituacaoPessoa = 'VITIMA' | 'AUTOR' | 'TESTEMUNHA';
export type CategoriaObjeto = 'GERAL' | 'ARMAMENTO' | 'ENTORPECENTE' | 'VEICULO';
export type StatusBUO = 'RASCUNHO' | 'EM_PREENCHIMENTO' | 'FINALIZADO' | 'PDF_GERADO' | 'ARQUIVADO';

export interface Pessoa {
  id: string;
  nome: string;
  idade: string;
  rg: string;
  endereco: string;
  situacao: SituacaoPessoa | '';
  destino: string;
  observacoes: string;
}

export interface Objeto {
  id: string;
  categoria: CategoriaObjeto;
  tipo: string;
  descricao: string;
  quantidade: string;
  unidade: string;
  numeroIdentificacao: string;
  situacao: string;
  observacoes: string;
  calibre: string;
  municoes: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  tipoApreensao: string;
  substancia: string;
  embalagem: string;
  placa: string;
  chassi: string;
  cor: string;
}

export interface IntegranteGuarnicao {
  id: string;
  nome: string;
  ci: string;
  funcao: string;
}

export interface PolicialResponsavel {
  nome: string;
  identificacaoFuncional: string;
  funcao: string;
  observacoes: string;
}

export interface ReciboDelegacia {
  nome: string;
  funcao: string;
  assinatura: string;
  data: string;
  hora: string;
  observacao: string;
}

export interface BUO {
  id: string;
  numeroBuo: string;
  data: string;
  hora: string;
  tipoOcorrencia: string;
  codigoOcorrencia: string;
  localOcorrencia: string;
  zona: string;
  pelotao: string;
  equipe: string;
  vtrMt: string;
  registroCiops: string;
  situacao: string;
  tco: boolean;
  flagrante: boolean;
  apresentacaoPessoas: boolean;
  veiculoRecuperado: boolean;
  auxilioPrestado: boolean;
  outros: boolean;
  pessoas: Pessoa[];
  objetos: Objeto[];
  relato: string;
  codigosOcorrencia: string[];
  guarnicao: IntegranteGuarnicao[];
  policial: PolicialResponsavel;
  recibo: ReciboDelegacia;
  observacoes: string;
  status: StatusBUO;
  createdAt: string;
  updatedAt: string;
  finalizadoEm?: string;
  finalizadoPor?: string;
  pdfGeradoEm?: string;
  hash?: string;
  versao: number;
}

export interface CodigoOcorrencia {
  id: string;
  codigo: string;
  descricao: string;
  ativo: boolean;
}
