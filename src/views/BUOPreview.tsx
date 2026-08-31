import { BUO, StatusBUO } from '../types/buo';
import { CODIGOS_OCORRENCIA } from '../data/codes';

interface Props {
  buo: BUO;
  onEdit: (id: string) => void;
  onFinalize: (id: string) => void;
  onGeneratePdf: (id: string) => void;
  onBack: () => void;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-px flex-1 bg-[#CDD5E0]" />
      <h3 className="font-display font-700 text-xs text-[#6B7A90] uppercase tracking-widest whitespace-nowrap">{children}</h3>
      <div className="h-px flex-1 bg-[#CDD5E0]" />
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | boolean | null }) {
  const display = value === true ? 'SIM' : value === false ? 'NÃO' : value || '—';
  return (
    <div>
      <p className="text-xs text-[#9BAABB] font-display font-600 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-[#0D1B2A] font-500 mt-0.5">{display}</p>
    </div>
  );
}

export default function BUOPreview({ buo, onEdit, onFinalize, onGeneratePdf, onBack }: Props) {
  const codigoSelecionados = buo.codigosOcorrencia.map(cod =>
    CODIGOS_OCORRENCIA.find(c => c.codigo === cod)
  ).filter(Boolean);

  const naturezas = [
    buo.tco && 'TCO',
    buo.flagrante && 'Flagrante',
    buo.apresentacaoPessoas && 'Apresentação de Pessoas',
    buo.veiculoRecuperado && 'Veículo Recuperado',
    buo.auxilioPrestado && 'Auxílio Prestado',
    buo.outros && 'Outros',
  ].filter(Boolean).join(' · ');

  const statusColors: Record<StatusBUO, string> = {
    RASCUNHO: 'bg-gray-100 text-gray-600',
    EM_PREENCHIMENTO: 'bg-blue-50 text-blue-700',
    FINALIZADO: 'bg-emerald-50 text-emerald-700',
    PDF_GERADO: 'bg-purple-50 text-purple-700',
    ARQUIVADO: 'bg-red-50 text-red-700',
  };

  const isEditable = buo.status !== 'FINALIZADO' && buo.status !== 'PDF_GERADO' && buo.status !== 'ARQUIVADO';
  const isFinalizado = buo.status === 'FINALIZADO' || buo.status === 'PDF_GERADO';

  return (
    <div className="h-full overflow-auto">
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-28 sm:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <button onClick={onBack} className="text-sm text-[#6B7A90] hover:text-[#0E2240] font-display font-600 mb-2 min-h-10 inline-flex items-center">← Voltar</button>
          <h1 className="font-display font-700 text-xl sm:text-2xl text-[#0E2240]">
            {isFinalizado ? 'BUO FINALIZADO' : 'Conferir boletim'}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-display font-600 ${statusColors[buo.status]}`}>
              {buo.status.replace('_', ' ')}
            </span>
          </div>
          {isFinalizado && (
            <p className="text-sm text-emerald-700 mt-2">Registro salvo localmente com sucesso.</p>
          )}
        </div>
        <div className="hidden sm:flex flex-col gap-2 items-stretch sm:items-end">
          <button
            onClick={() => onEdit(buo.id)}
            className="min-h-11 px-4 py-2 text-sm rounded-xl border border-[#CDD5E0] font-display font-600 text-[#1A3A5C] hover:bg-[#EEF2F8]"
          >
            Voltar e editar
          </button>
          {isEditable && (
            <button
              onClick={() => { onFinalize(buo.id); }}
              className="min-h-11 px-4 py-2 text-sm rounded-xl font-display font-600 text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Finalizar BUO
            </button>
          )}
          <button
            onClick={() => onGeneratePdf(buo.id)}
            className="min-h-11 px-4 py-2 text-sm rounded-xl font-display font-700 text-white bg-[#1A3A5C] hover:bg-[#0E2240]"
          >
            Gerar PDF
          </button>
        </div>
      </div>

      {/* 1. Identificação */}
        <div className="bg-white rounded-xl border border-[#CDD5E0] p-4 sm:p-5">
          <SectionTitle>1. Identificação da Ocorrência</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Field label="Pelotão" value={buo.pelotao} />
          <Field label="Equipe" value={buo.equipe} />
          <Field label="VTR/MT" value={buo.vtrMt} />
          <Field label="Data" value={formatDate(buo.data)} />
          <Field label="Hora" value={buo.hora} />
          <Field label="Cidade / Município" value={buo.municipio} />
          <Field label="Bairro" value={buo.bairro} />
          <Field label="Zona" value={buo.zona} />
          <Field label="Tipo de Ocorrência" value={buo.tipoOcorrencia} />
          <Field
            label="Código da ocorrência"
            value={buo.codigoOcorrencia || buo.codigosOcorrencia.join(', ')}
          />
          <Field label="Nº BUO" value={buo.numeroBuo} />
          <Field label="Local" value={buo.localOcorrencia} />
          <Field label="Nº CIOPS" value={buo.registroCiops} />
        </div>
        {naturezas && (
          <div className="mt-4 pt-4 border-t border-[#EEF2F8]">
            <p className="text-xs text-[#9BAABB] font-display font-600 uppercase tracking-wide mb-1">Natureza</p>
            <p className="text-sm text-[#0D1B2A] font-500">{naturezas}</p>
          </div>
        )}
      </div>

      {/* 2. Pessoas */}
      <div className="bg-white rounded border border-[#CDD5E0] p-5">
        <SectionTitle>2. Pessoas Envolvidas ({buo.pessoas.length})</SectionTitle>
        {buo.pessoas.length === 0 ? (
          <p className="text-sm text-[#9BAABB] text-center py-4">Nenhuma pessoa cadastrada</p>
        ) : (
          <div className="space-y-3">
            {buo.pessoas.map((p, i) => (
              <div key={p.id} className="p-3 rounded bg-[#F8FAFC] border border-[#EEF2F8]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-[#9BAABB]">#{i + 1}</span>
                  <span className="font-display font-700 text-sm text-[#0E2240]">{p.nome}</span>
                  {p.situacao && (
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-display font-600 ${
                      p.situacao === 'VITIMA' ? 'bg-blue-50 text-blue-700' :
                      p.situacao === 'AUTOR' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>{p.situacao}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Idade" value={p.idade} />
                  <Field label="RG" value={p.rg} />
                  <Field label="Endereço" value={p.endereco} />
                  <Field label="Destino" value={p.destino} />
                </div>
                {p.observacoes && (
                  <div className="mt-2 pt-2 border-t border-[#EEF2F8]">
                    <Field label="Observações" value={p.observacoes} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Objetos */}
      <div className="bg-white rounded border border-[#CDD5E0] p-5">
        <SectionTitle>3. Objetos / Apreensões ({buo.objetos.length})</SectionTitle>
        {buo.objetos.length === 0 ? (
          <p className="text-sm text-[#9BAABB] text-center py-4">Nenhum objeto cadastrado</p>
        ) : (
          <div className="space-y-3">
            {buo.objetos.map((o, i) => (
              <div key={o.id} className="p-3 rounded bg-[#F8FAFC] border border-[#EEF2F8]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-[#9BAABB]">#{i + 1}</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-display font-600 ${
                    o.categoria === 'ARMAMENTO' ? 'bg-red-50 text-red-700' :
                    o.categoria === 'ENTORPECENTE' ? 'bg-purple-50 text-purple-700' :
                    o.categoria === 'VEICULO' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{o.categoria}</span>
                  <span className="font-display font-600 text-sm text-[#0E2240]">{o.tipo || o.substancia || o.marca || '—'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {o.categoria === 'ARMAMENTO' && <>
                    <Field label="Marca" value={o.marca} />
                    <Field label="Modelo" value={o.modelo} />
                    <Field label="Calibre" value={o.calibre} />
                    <Field label="Nº Série" value={o.numeroSerie} />
                    <Field label="Munições" value={o.municoes} />
                  </>}
                  {o.categoria === 'ENTORPECENTE' && <>
                    <Field label="Tipo" value={o.tipo} />
                    <Field label="Substância" value={o.substancia} />
                    <Field label="Tipo de Apreensão" value={o.tipoApreensao} />
                    <Field label="Quantidade" value={`${o.quantidade} ${o.unidade}`} />
                    <Field label="Embalagem" value={o.embalagem} />
                  </>}
                  {o.categoria === 'VEICULO' && <>
                    <Field label="Marca/Modelo" value={`${o.marca} ${o.modelo}`} />
                    <Field label="Placa" value={o.placa} />
                    <Field label="Cor" value={o.cor} />
                    <Field label="Chassi" value={o.chassi} />
                  </>}
                  {o.categoria === 'GERAL' && <>
                    <Field label="Descrição" value={o.descricao} />
                    <Field label="Quantidade" value={`${o.quantidade} ${o.unidade}`} />
                    <Field label="Nº Identificação" value={o.numeroIdentificacao} />
                  </>}
                  <Field label="Situação" value={o.situacao} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Relato */}
      <div className="bg-white rounded border border-[#CDD5E0] p-5">
        <SectionTitle>4. Relato da Ocorrência</SectionTitle>
        <div className="bg-[#F8FAFC] rounded border border-[#EEF2F8] p-4">
          <p className="text-sm text-[#0D1B2A] whitespace-pre-wrap leading-relaxed">
            {buo.relato || <span className="text-[#9BAABB]">Relato não preenchido</span>}
          </p>
        </div>
      </div>

      {/* 5. Códigos */}
      {buo.codigosOcorrencia.length > 0 && (
        <div className="bg-white rounded border border-[#CDD5E0] p-5">
          <SectionTitle>5. Códigos de Ocorrência</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {codigoSelecionados.map(c => c && (
              <span key={c.id} className="inline-flex px-2 py-1 rounded bg-[#0E2240] text-white text-xs font-display font-600">
                {c.codigo} — {c.descricao}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 6. Guarnição */}
      <div className="bg-white rounded border border-[#CDD5E0] p-5">
        <SectionTitle>6. Guarnição ({buo.guarnicao.length})</SectionTitle>
        {buo.guarnicao.length === 0 ? (
          <p className="text-sm text-[#9BAABB] text-center py-4">Guarnição não preenchida</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {buo.guarnicao.map((g, i) => (
              <div key={g.id} className="flex items-center gap-3 p-3 rounded bg-[#F8FAFC] border border-[#EEF2F8]">
                <span className="font-mono text-xs text-[#9BAABB] w-5 text-center">{i + 1}</span>
                <div>
                  <p className="font-display font-600 text-sm text-[#0E2240]">{g.nome || '—'}</p>
                  <p className="text-xs text-[#6B7A90]">{g.funcao || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Observações */}
      {buo.observacoes && (
        <div className="bg-white rounded border border-[#CDD5E0] p-5">
          <SectionTitle>7. Observações Gerais</SectionTitle>
          <p className="text-sm text-[#0D1B2A] whitespace-pre-wrap">{buo.observacoes}</p>
        </div>
      )}

      {/* 8. Recibo */}
      <div className="bg-white rounded border border-[#CDD5E0] p-5">
        <SectionTitle>8. Recibo — Delegacia de Polícia</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Nome" value={buo.recibo.nome} />
          <Field
            label="Nº ID. Funcional"
            value={buo.recibo.identificacaoFuncional || buo.policial.identificacaoFuncional}
          />
          <Field label="Função" value={buo.recibo.funcao} />
          <Field label="Data" value={buo.recibo.data ? formatDate(buo.recibo.data) : undefined} />
          <Field label="Hora" value={buo.recibo.hora} />
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs text-[#9BAABB] font-display font-600 uppercase tracking-wide mb-1">
              Assinatura / Identificação (Gov.br)
            </p>
            <div className="min-h-[100px] rounded-lg border border-[#CDD5E0] bg-[#F8FAFC] p-3 space-y-2">
              {buo.recibo.assinaturaImagem?.startsWith('data:image') && (
                <img src={buo.recibo.assinaturaImagem} alt="Assinatura" className="max-h-24 object-contain bg-white rounded border border-[#EEF2F8]" />
              )}
              {buo.recibo.assinaturaUrl?.trim() && (
                <a
                  href={buo.recibo.assinaturaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-[#1351B4] break-all underline"
                >
                  {buo.recibo.assinaturaUrl}
                </a>
              )}
              {buo.recibo.assinatura?.trim() && (
                <p className="text-sm text-[#0D1B2A] whitespace-pre-wrap">{buo.recibo.assinatura}</p>
              )}
              {!buo.recibo.assinaturaImagem && !buo.recibo.assinaturaUrl?.trim() && !buo.recibo.assinatura?.trim() && (
                <span className="text-[#9BAABB]">—</span>
              )}
            </div>
          </div>
        </div>
        {buo.recibo.observacao && (
          <div className="mt-3 pt-3 border-t border-[#EEF2F8]">
            <Field label="Observação" value={buo.recibo.observacao} />
          </div>
        )}
      </div>

      <div className="hidden sm:flex flex-wrap justify-end gap-3 pb-6">
        <button
          onClick={() => onEdit(buo.id)}
          className="min-h-11 px-5 py-2.5 text-sm rounded-xl border border-[#CDD5E0] font-display font-600 text-[#1A3A5C] hover:bg-[#EEF2F8]"
        >
          Voltar e editar
        </button>
        {isEditable && (
          <button
            onClick={() => onFinalize(buo.id)}
            className="min-h-11 px-5 py-2.5 text-sm rounded-xl font-display font-600 text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Finalizar BUO
          </button>
        )}
        <button
          onClick={() => onGeneratePdf(buo.id)}
          className="min-h-11 px-5 py-2.5 text-sm rounded-xl font-display font-700 text-white bg-[#1A3A5C] hover:bg-[#0E2240]"
        >
          Gerar PDF
        </button>
      </div>
      </div>

      {/* Dock mobile */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 buo-bottom-dock bg-white border-t border-[#CDD5E0] px-3 pt-3 z-40">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(buo.id)}
            className="flex-1 min-h-12 rounded-xl border border-[#CDD5E0] font-display font-600 text-sm text-[#0E2240]"
          >
            Editar
          </button>
          <button
            onClick={() => onGeneratePdf(buo.id)}
            className="flex-[1.4] min-h-12 rounded-xl font-display font-700 text-sm text-white"
            style={{ background: '#0E2240' }}
          >
            Gerar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
