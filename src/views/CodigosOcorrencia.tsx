import { useState } from 'react';
import { CODIGOS_OCORRENCIA } from '../data/codes';

export default function CodigosOcorrencia() {
  const [search, setSearch] = useState('');

  const filtered = CODIGOS_OCORRENCIA.filter(c =>
    !search ||
    c.descricao.toLowerCase().includes(search.toLowerCase()) ||
    c.codigo.includes(search)
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-display font-700 text-2xl text-[#0E2240]">Códigos de Ocorrência</h1>
        <p className="text-[#6B7A90] text-sm mt-0.5">{CODIGOS_OCORRENCIA.length} códigos registrados no sistema</p>
      </div>

      <div className="bg-white rounded border border-[#CDD5E0] p-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por código ou descrição..."
          className="w-full px-3 py-2.5 border border-[#CDD5E0] rounded text-sm focus:outline-none focus:border-[#1A3A5C]"
        />
        {search && (
          <p className="text-xs text-[#6B7A90] mt-2">{filtered.length} resultado(s)</p>
        )}
      </div>

      <div className="bg-white rounded border border-[#CDD5E0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#CDD5E0] bg-[#F3F5F9]">
              <th className="text-left px-4 py-3 text-[#6B7A90] font-display font-600 text-xs uppercase tracking-wide w-24">Código</th>
              <th className="text-left px-4 py-3 text-[#6B7A90] font-display font-600 text-xs uppercase tracking-wide">Descrição</th>
              <th className="text-left px-4 py-3 text-[#6B7A90] font-display font-600 text-xs uppercase tracking-wide w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-[#EEF2F8] hover:bg-[#F8FAFC] transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs font-500 text-[#0E2240]">{c.codigo}</td>
                <td className="px-4 py-2.5 font-display font-500 text-[#0D1B2A]">{c.descricao}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-display font-600 ${c.ativo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-[#9BAABB] text-sm">
                  Nenhum resultado para "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
