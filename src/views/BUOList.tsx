import { useState } from 'react';
import { BUO, StatusBUO } from '../types/buo';

interface Props {
  buos: BUO[];
  onNavigate: (view: string, id?: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const STATUS_LABELS: Record<StatusBUO, string> = {
  RASCUNHO: 'Rascunho',
  EM_PREENCHIMENTO: 'Em Preenchimento',
  FINALIZADO: 'Finalizado',
  PDF_GERADO: 'PDF Gerado',
  ARQUIVADO: 'Arquivado',
};

const STATUS_COLORS: Record<StatusBUO, string> = {
  RASCUNHO: 'bg-gray-100 text-gray-600',
  EM_PREENCHIMENTO: 'bg-blue-50 text-blue-700',
  FINALIZADO: 'bg-emerald-50 text-emerald-700',
  PDF_GERADO: 'bg-purple-50 text-purple-700',
  ARQUIVADO: 'bg-red-50 text-red-700',
};

function formatDate(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function BUOList({ buos, onNavigate, onArchive, onDelete, onDuplicate }: Props) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusBUO | ''>('');
  const [filterDataIni, setFilterDataIni] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');

  const filtered = buos.filter(b => {
    const s = search.toLowerCase();
    const matchSearch = !s ||
      b.numeroBuo.toLowerCase().includes(s) ||
      b.localOcorrencia.toLowerCase().includes(s) ||
      b.equipe.toLowerCase().includes(s) ||
      b.tipoOcorrencia.toLowerCase().includes(s) ||
      b.registroCiops.toLowerCase().includes(s) ||
      b.vtrMt.toLowerCase().includes(s);
    const matchStatus = !filterStatus || b.status === filterStatus;
    const matchIni = !filterDataIni || b.data >= filterDataIni;
    const matchFim = !filterDataFim || b.data <= filterDataFim;
    return matchSearch && matchStatus && matchIni && matchFim;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-[#0E2240]">Consultar BUOs</h1>
          <p className="text-[#6B7A90] text-sm mt-0.5">{buos.length} registro(s) no sistema</p>
        </div>
        <button
          onClick={() => onNavigate('form-new')}
          className="flex items-center gap-2 px-5 py-2.5 rounded font-display font-600 text-sm text-white"
          style={{ background: '#0E2240' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1A3A5C')}
          onMouseLeave={e => (e.currentTarget.style.background = '#0E2240')}
        >
          <span className="text-[#B8820A] font-800">+</span> Novo BUO
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-[#CDD5E0] p-4">
        <p className="font-display font-600 text-xs text-[#6B7A90] uppercase tracking-wide mb-3">Filtros</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-display font-600 text-[#374151] mb-1">Busca geral</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Nº BUO, local, equipe..."
              className="w-full px-3 py-2 border border-[#CDD5E0] rounded text-sm focus:outline-none focus:border-[#1A3A5C]"
            />
          </div>
          <div>
            <label className="block text-xs font-display font-600 text-[#374151] mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as StatusBUO | '')}
              className="w-full px-3 py-2 border border-[#CDD5E0] rounded text-sm focus:outline-none focus:border-[#1A3A5C]"
            >
              <option value="">Todos</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-display font-600 text-[#374151] mb-1">Data inicial</label>
            <input
              type="date"
              value={filterDataIni}
              onChange={e => setFilterDataIni(e.target.value)}
              className="w-full px-3 py-2 border border-[#CDD5E0] rounded text-sm focus:outline-none focus:border-[#1A3A5C]"
            />
          </div>
          <div>
            <label className="block text-xs font-display font-600 text-[#374151] mb-1">Data final</label>
            <input
              type="date"
              value={filterDataFim}
              onChange={e => setFilterDataFim(e.target.value)}
              className="w-full px-3 py-2 border border-[#CDD5E0] rounded text-sm focus:outline-none focus:border-[#1A3A5C]"
            />
          </div>
        </div>
        {(search || filterStatus || filterDataIni || filterDataFim) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); setFilterDataIni(''); setFilterDataFim(''); }}
            className="mt-3 text-xs text-[#6B7A90] hover:text-[#0E2240] transition-colors font-display font-600"
          >
            ✕ Limpar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-[#CDD5E0]">
        <div className="px-5 py-3 border-b border-[#CDD5E0]">
          <p className="text-sm text-[#6B7A90]">
            {filtered.length} resultado(s) de {buos.length} total
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3 opacity-20">🔍</div>
            <p className="font-display font-600 text-[#0E2240]">Nenhum resultado encontrado</p>
            <p className="text-[#6B7A90] text-sm mt-1">Ajuste os filtros ou registre um novo BUO.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#CDD5E0]">
                  {['Nº BUO', 'Data', 'Hora', 'Tipo de Ocorrência', 'Local', 'VTR/MT', 'Equipe', 'Status', 'Ações'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[#6B7A90] font-display font-600 text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(buo => (
                  <tr key={buo.id} className="border-b border-[#EEF2F8] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-500 text-[#0E2240] whitespace-nowrap">{buo.numeroBuo}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(buo.data)}</td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{buo.hora || '—'}</td>
                    <td className="px-4 py-3 max-w-[130px] truncate">{buo.tipoOcorrencia || '—'}</td>
                    <td className="px-4 py-3 max-w-[140px] truncate">{buo.localOcorrencia || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{buo.vtrMt || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{buo.equipe || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-display font-600 whitespace-nowrap ${STATUS_COLORS[buo.status]}`}>
                        {STATUS_LABELS[buo.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          onClick={() => onNavigate('preview', buo.id)}
                          className="px-2 py-1 text-xs rounded bg-[#EEF2F8] text-[#1A3A5C] hover:bg-[#CDD5E0] transition-colors font-display font-600"
                        >Ver</button>
                        <button
                          onClick={() => onNavigate('form', buo.id)}
                          className="px-2 py-1 text-xs rounded bg-[#EEF2F8] text-[#1A3A5C] hover:bg-[#CDD5E0] transition-colors font-display font-600"
                        >Editar</button>
                        <button
                          onClick={() => onNavigate('pdf', buo.id)}
                          className="px-2 py-1 text-xs rounded bg-[#0E2240] text-white hover:bg-[#1A3A5C] transition-colors font-display font-600"
                        >PDF</button>
                        <button
                          onClick={() => { if (confirm('Duplicar este BUO?')) onDuplicate(buo.id); }}
                          className="px-2 py-1 text-xs rounded bg-[#EEF2F8] text-[#1A3A5C] hover:bg-[#CDD5E0] transition-colors font-display font-600"
                        >Duplicar</button>
                        {buo.status !== 'ARQUIVADO' && (
                          <button
                            onClick={() => { if (confirm('Arquivar este BUO?')) onArchive(buo.id); }}
                            className="px-2 py-1 text-xs rounded bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors font-display font-600"
                          >Arquivar</button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este registro?')) onDelete(buo.id);
                          }}
                          className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-display font-600"
                        >Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
