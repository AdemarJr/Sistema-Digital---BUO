import { useState, useEffect, useRef, useCallback } from 'react';
import { BUO, Pessoa, Objeto, IntegranteGuarnicao, CategoriaObjeto } from '../types/buo';
import { CODIGOS_OCORRENCIA, TIPOS_OCORRENCIA, ZONAS } from '../data/codes';
import Modal from '../components/Modal';
import { newPessoa, newObjeto, newIntegrante } from '../hooks/useBuoStore';
import { splitDateParts } from '../utils/date';

interface Props {
  buo: BUO;
  onSave: (buo: BUO) => void;
  onFinalize: (id: string) => void;
  onPreview: (id: string) => void;
  onBack: () => void;
}

const STEPS = [
  'Identificação',
  'Pessoas Envolvidas',
  'Objetos / Apreensões',
  'Relato',
  'Códigos',
  'Guarnição',
  'Identificação Funcional',
  'Observações',
  'Recibo — Delegacia',
];

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-xs font-display font-600 text-[#374151] mb-1">
      {text}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; required?: boolean }) {
  const { label, required, className, ...rest } = props;
  return (
    <div>
      {label && <Label text={label} required={required} />}
      <input
        {...rest}
        className={`w-full min-h-11 px-3 py-2.5 border border-[#CDD5E0] rounded-lg text-base sm:text-sm focus:outline-none focus:border-[#1A3A5C] focus:ring-1 focus:ring-[#1A3A5C]/20 transition-colors ${className ?? ''}`}
      />
    </div>
  );
}

function Textarea({ label, required, rows = 5, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; required?: boolean }) {
  return (
    <div>
      {label && <Label text={label} required={required} />}
      <textarea
        rows={rows}
        {...props}
        className={`w-full px-3 py-2.5 border border-[#CDD5E0] rounded-lg text-base sm:text-sm focus:outline-none focus:border-[#1A3A5C] transition-colors resize-none ${props.className ?? ''}`}
      />
    </div>
  );
}

function Select({ label, required, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; required?: boolean }) {
  return (
    <div>
      {label && <Label text={label} required={required} />}
      <select
        {...props}
        className={`w-full min-h-11 px-3 py-2.5 border border-[#CDD5E0] rounded-lg text-base sm:text-sm focus:outline-none focus:border-[#1A3A5C] transition-colors bg-white ${props.className ?? ''}`}
      >
        {children}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 min-h-11 px-3 py-2 rounded-lg border text-xs font-display font-600 transition-all ${
        checked
          ? 'border-[#0E2240] bg-[#0E2240] text-white'
          : 'border-[#CDD5E0] bg-white text-[#6B7A90] active:border-[#1A3A5C]'
      }`}
    >
      <span>{checked ? '✓' : '○'}</span>
      {label}
    </button>
  );
}

// ─── Step 1: Identificação ────────────────────────────────────────────────────
function StepIdentificacao({ buo, onChange }: { buo: BUO; onChange: (b: Partial<BUO>) => void }) {
  const parts = splitDateParts(buo.data);

  const setDateFromParts = (dia: string, mes: string, ano: string) => {
    if (dia.length === 2 && mes.length === 2 && ano.length === 4) {
      onChange({ data: `${ano}-${mes}-${dia}` });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Input label="Data" required type="date" value={buo.data} onChange={e => onChange({ data: e.target.value })} />
        <Input label="Hora" required type="time" value={buo.hora} onChange={e => onChange({ hora: e.target.value })} />
        <Select label="Zona" value={buo.zona} onChange={e => onChange({ zona: e.target.value })}>
          <option value="">Selecione...</option>
          {ZONAS.map(z => <option key={z}>{z}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-md">
        <Input
          label="Dia"
          value={parts.dia}
          maxLength={2}
          onChange={e => setDateFromParts(e.target.value.replace(/\D/g, '').slice(0, 2), parts.mes, parts.ano)}
          placeholder="DD"
        />
        <Input
          label="Mês"
          value={parts.mes}
          maxLength={2}
          onChange={e => setDateFromParts(parts.dia, e.target.value.replace(/\D/g, '').slice(0, 2), parts.ano)}
          placeholder="MM"
        />
        <Input
          label="Ano"
          value={parts.ano}
          maxLength={4}
          onChange={e => setDateFromParts(parts.dia, parts.mes, e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="AAAA"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select label="Tipo de Ocorrência" required value={buo.tipoOcorrencia} onChange={e => onChange({ tipoOcorrencia: e.target.value })}>
          <option value="">Selecione...</option>
          {TIPOS_OCORRENCIA.map(t => <option key={t}>{t}</option>)}
        </Select>
        <Input label="Código da ocorrência" value={buo.codigoOcorrencia} onChange={e => onChange({ codigoOcorrencia: e.target.value })} placeholder="Ex.: 016" />
      </div>

      <Input label="Local da Ocorrência" required value={buo.localOcorrencia} onChange={e => onChange({ localOcorrencia: e.target.value })} placeholder="Endereço completo" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input label="Pelotão" value={buo.pelotao} onChange={e => onChange({ pelotao: e.target.value })} />
        <Input label="Equipe" value={buo.equipe} onChange={e => onChange({ equipe: e.target.value })} />
        <Input label="VTR/MT" value={buo.vtrMt} onChange={e => onChange({ vtrMt: e.target.value })} />
        <Input label="Nº Registro CIOPS" value={buo.registroCiops} onChange={e => onChange({ registroCiops: e.target.value })} />
      </div>

      <div>
        <Input label="Situação" value={buo.situacao} onChange={e => onChange({ situacao: e.target.value })} placeholder="Ex.: Em investigação, Encerrada..." />
      </div>

      <div>
        <Label text="Natureza do Registro" />
        <div className="flex flex-wrap gap-2 mt-2">
          <Toggle label="TCO" checked={buo.tco} onChange={v => onChange({ tco: v })} />
          <Toggle label="FLAGRANTE" checked={buo.flagrante} onChange={v => onChange({ flagrante: v })} />
          <Toggle label="APRES. DE PESSOAS" checked={buo.apresentacaoPessoas} onChange={v => onChange({ apresentacaoPessoas: v })} />
          <Toggle label="VEÍCULO RECUPERADO" checked={buo.veiculoRecuperado} onChange={v => onChange({ veiculoRecuperado: v })} />
          <Toggle label="AUX. PRESTADO" checked={buo.auxilioPrestado} onChange={v => onChange({ auxilioPrestado: v })} />
          <Toggle label="OUTROS" checked={buo.outros} onChange={v => onChange({ outros: v })} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Pessoas ──────────────────────────────────────────────────────────
function StepPessoas({ buo, onChange }: { buo: BUO; onChange: (b: Partial<BUO>) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);
  const [form, setForm] = useState<Pessoa>(newPessoa());

  const openNew = () => { setForm(newPessoa()); setEditingPessoa(null); setModalOpen(true); };
  const openEdit = (p: Pessoa) => { setForm({ ...p }); setEditingPessoa(p); setModalOpen(true); };

  const save = () => {
    if (!form.nome.trim()) return;
    const pessoas = editingPessoa
      ? buo.pessoas.map(p => p.id === editingPessoa.id ? form : p)
      : [...buo.pessoas, form];
    onChange({ pessoas });
    setModalOpen(false);
  };

  const remove = (id: string) => {
    if (!confirm('Remover esta pessoa?')) return;
    onChange({ pessoas: buo.pessoas.filter(p => p.id !== id) });
  };

  const situacaoColor: Record<string, string> = {
    VITIMA: 'bg-blue-50 text-blue-700',
    AUTOR: 'bg-red-50 text-red-700',
    TESTEMUNHA: 'bg-yellow-50 text-yellow-700',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B7A90]">{buo.pessoas.length} pessoa(s) cadastrada(s)</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded font-display font-600 text-sm text-white"
          style={{ background: '#0E2240' }}
        >
          <span className="text-[#B8820A]">+</span> Adicionar Pessoa
        </button>
      </div>

      {buo.pessoas.length === 0 ? (
        <div className="border-2 border-dashed border-[#CDD5E0] rounded p-10 text-center">
          <p className="text-[#6B7A90] text-sm font-display font-500">Nenhuma pessoa cadastrada</p>
          <p className="text-[#9BAABB] text-xs mt-1">Clique em "Adicionar Pessoa" para incluir vítimas, autores ou testemunhas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-[#CDD5E0]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#CDD5E0] bg-[#F3F5F9]">
                {['Nome', 'Idade', 'RG', 'Situação', 'Destino', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[#6B7A90] font-display font-600 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buo.pessoas.map(p => (
                <tr key={p.id} className="border-b border-[#EEF2F8] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 font-500">{p.nome}</td>
                  <td className="px-4 py-3">{p.idade || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.rg || '—'}</td>
                  <td className="px-4 py-3">
                    {p.situacao ? (
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-display font-600 ${situacaoColor[p.situacao] ?? ''}`}>
                        {p.situacao}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 max-w-[150px] truncate">{p.destino || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="px-2 py-1 text-xs rounded bg-[#EEF2F8] text-[#1A3A5C] hover:bg-[#CDD5E0] font-display font-600">Editar</button>
                      <button onClick={() => remove(p.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100 font-display font-600">Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPessoa ? 'Editar Pessoa' : 'Adicionar Pessoa'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded border border-[#CDD5E0] font-display font-600 hover:bg-[#F3F5F9]">Cancelar</button>
            <button onClick={save} className="px-4 py-2 text-sm rounded font-display font-600 text-white" style={{ background: '#0E2240' }}>Salvar</button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Nome Completo" required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Idade" type="number" value={form.idade} onChange={e => setForm(f => ({ ...f, idade: e.target.value }))} />
            <Input label="RG" value={form.rg} onChange={e => setForm(f => ({ ...f, rg: e.target.value }))} />
          </div>
          <Input label="Endereço" value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} />
          <Select label="Situação" value={form.situacao} onChange={e => setForm(f => ({ ...f, situacao: e.target.value as any }))}>
            <option value="">Selecione...</option>
            <option value="VITIMA">VÍTIMA</option>
            <option value="AUTOR">AUTOR</option>
            <option value="TESTEMUNHA">TESTEMUNHA</option>
          </Select>
          <Input label="Destino" value={form.destino} onChange={e => setForm(f => ({ ...f, destino: e.target.value }))} placeholder="Ex.: Delegacia de Polícia, Hospital..." />
          <Textarea label="Observações" rows={3} value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}

// ─── Step 3: Objetos ──────────────────────────────────────────────────────────
function StepObjetos({ buo, onChange }: { buo: BUO; onChange: (b: Partial<BUO>) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Objeto | null>(null);
  const [form, setForm] = useState<Objeto>(newObjeto());
  const [filterCat, setFilterCat] = useState<CategoriaObjeto | ''>('');

  const openNew = (cat?: CategoriaObjeto) => {
    setForm({ ...newObjeto(), categoria: cat ?? 'GERAL' });
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (o: Objeto) => { setForm({ ...o }); setEditing(o); setModalOpen(true); };

  const save = () => {
    const objetos = editing
      ? buo.objetos.map(o => o.id === editing.id ? form : o)
      : [...buo.objetos, form];
    onChange({ objetos });
    setModalOpen(false);
  };

  const remove = (id: string) => {
    if (!confirm('Remover este item?')) return;
    onChange({ objetos: buo.objetos.filter(o => o.id !== id) });
  };

  const catLabel: Record<CategoriaObjeto, string> = {
    GERAL: 'Geral',
    ARMAMENTO: 'Armamento',
    ENTORPECENTE: 'Entorpecente',
    VEICULO: 'Veículo',
  };

  const catColor: Record<CategoriaObjeto, string> = {
    GERAL: 'bg-gray-100 text-gray-600',
    ARMAMENTO: 'bg-red-50 text-red-700',
    ENTORPECENTE: 'bg-purple-50 text-purple-700',
    VEICULO: 'bg-blue-50 text-blue-700',
  };

  const filtered = filterCat ? buo.objetos.filter(o => o.categoria === filterCat) : buo.objetos;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#6B7A90]">{buo.objetos.length} item(s) cadastrado(s)</p>
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value as any)}
            className="text-xs border border-[#CDD5E0] rounded px-2 py-1 text-[#374151]"
          >
            <option value="">Todas categorias</option>
            {Object.entries(catLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => openNew('GERAL')} className="px-3 py-1.5 text-xs rounded font-display font-600 bg-gray-100 text-gray-700 hover:bg-gray-200">+ Geral</button>
          <button onClick={() => openNew('ARMAMENTO')} className="px-3 py-1.5 text-xs rounded font-display font-600 bg-red-50 text-red-700 hover:bg-red-100">+ Armamento</button>
          <button onClick={() => openNew('ENTORPECENTE')} className="px-3 py-1.5 text-xs rounded font-display font-600 bg-purple-50 text-purple-700 hover:bg-purple-100">+ Entorpecente</button>
          <button onClick={() => openNew('VEICULO')} className="px-3 py-1.5 text-xs rounded font-display font-600 bg-blue-50 text-blue-700 hover:bg-blue-100">+ Veículo</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-[#CDD5E0] rounded p-10 text-center">
          <p className="text-[#6B7A90] text-sm font-display font-500">Nenhum objeto/apreensão cadastrada</p>
          <p className="text-[#9BAABB] text-xs mt-1">Use os botões acima para adicionar armamentos, entorpecentes, veículos ou outros objetos.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-[#CDD5E0]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#CDD5E0] bg-[#F3F5F9]">
                {['Categoria', 'Tipo', 'Descrição / Identificação', 'Qtd', 'Situação', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[#6B7A90] font-display font-600 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-[#EEF2F8] hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-display font-600 ${catColor[o.categoria]}`}>
                      {catLabel[o.categoria]}
                    </span>
                  </td>
                  <td className="px-4 py-3">{o.tipo || '—'}</td>
                  <td className="px-4 py-3 max-w-[180px] truncate">
                    {o.categoria === 'ARMAMENTO' ? `${o.marca} ${o.modelo} ${o.calibre}` :
                     o.categoria === 'VEICULO' ? `${o.marca} ${o.modelo} — ${o.placa}` :
                     o.categoria === 'ENTORPECENTE' ? o.substancia :
                     o.descricao || '—'}
                  </td>
                  <td className="px-4 py-3">{o.quantidade || '—'}</td>
                  <td className="px-4 py-3">{o.situacao || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(o)} className="px-2 py-1 text-xs rounded bg-[#EEF2F8] text-[#1A3A5C] hover:bg-[#CDD5E0] font-display font-600">Editar</button>
                      <button onClick={() => remove(o.id)} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100 font-display font-600">Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Item' : 'Adicionar Item'} size="xl"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded border border-[#CDD5E0] font-display font-600 hover:bg-[#F3F5F9]">Cancelar</button>
            <button onClick={save} className="px-4 py-2 text-sm rounded font-display font-600 text-white" style={{ background: '#0E2240' }}>Salvar</button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Categoria" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value as CategoriaObjeto }))}>
            <option value="GERAL">Geral</option>
            <option value="ARMAMENTO">Armamento</option>
            <option value="ENTORPECENTE">Entorpecente</option>
            <option value="VEICULO">Veículo</option>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Tipo" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} />
            <Input label="Tipo de Apreensão" value={form.tipoApreensao} onChange={e => setForm(f => ({ ...f, tipoApreensao: e.target.value }))} />
          </div>

          {form.categoria === 'GERAL' && (
            <>
              <Textarea label="Descrição" rows={2} value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
              <div className="grid grid-cols-3 gap-3">
                <Input label="Quantidade" type="number" value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} />
                <Input label="Unidade" value={form.unidade} onChange={e => setForm(f => ({ ...f, unidade: e.target.value }))} />
                <Input label="Nº Identificação" value={form.numeroIdentificacao} onChange={e => setForm(f => ({ ...f, numeroIdentificacao: e.target.value }))} />
              </div>
            </>
          )}

          {form.categoria === 'ARMAMENTO' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Marca" value={form.marca} onChange={e => setForm(f => ({ ...f, marca: e.target.value }))} />
                <Input label="Modelo" value={form.modelo} onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))} />
                <Input label="Calibre" value={form.calibre} onChange={e => setForm(f => ({ ...f, calibre: e.target.value }))} />
                <Input label="Qtd. de Munições" type="number" value={form.municoes} onChange={e => setForm(f => ({ ...f, municoes: e.target.value }))} />
                <Input label="Número de Série" value={form.numeroSerie} onChange={e => setForm(f => ({ ...f, numeroSerie: e.target.value }))} />
                <Input label="Quantidade" type="number" value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} />
              </div>
            </>
          )}

          {form.categoria === 'ENTORPECENTE' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Substância" value={form.substancia} onChange={e => setForm(f => ({ ...f, substancia: e.target.value }))} />
                <Input label="Embalagem" value={form.embalagem} onChange={e => setForm(f => ({ ...f, embalagem: e.target.value }))} />
                <Input label="Quantidade" value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} />
                <Input label="Unidade de Medida" value={form.unidade} onChange={e => setForm(f => ({ ...f, unidade: e.target.value }))} placeholder="g, kg, unid..." />
              </div>
            </>
          )}

          {form.categoria === 'VEICULO' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Marca" value={form.marca} onChange={e => setForm(f => ({ ...f, marca: e.target.value }))} />
                <Input label="Modelo" value={form.modelo} onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))} />
                <Input label="Placa" value={form.placa} onChange={e => setForm(f => ({ ...f, placa: e.target.value }))} />
                <Input label="Cor" value={form.cor} onChange={e => setForm(f => ({ ...f, cor: e.target.value }))} />
                <Input label="Chassi" value={form.chassi} onChange={e => setForm(f => ({ ...f, chassi: e.target.value }))} />
              </div>
            </>
          )}

          <Input label="Situação" value={form.situacao} onChange={e => setForm(f => ({ ...f, situacao: e.target.value }))} placeholder="Ex.: Apreendido, Devolvido..." />
          <Textarea label="Observações" rows={2} value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}

// ─── Step 4: Relato ───────────────────────────────────────────────────────────
function StepRelato({ buo, onChange }: { buo: BUO; onChange: (b: Partial<BUO>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label text="RELATO DA OCORRÊNCIA" required />
          <span className="text-xs text-[#6B7A90] font-mono">{buo.relato.length} caracteres</span>
        </div>
        <textarea
          rows={18}
          required
          value={buo.relato}
          onChange={e => onChange({ relato: e.target.value })}
          placeholder="Descreva de forma completa e detalhada os fatos ocorridos..."
          className="w-full px-4 py-3 border border-[#CDD5E0] rounded text-sm focus:outline-none focus:border-[#1A3A5C] transition-colors resize-none leading-relaxed"
        />
        <p className="text-xs text-[#9BAABB] mt-1">O relato é preservado exatamente como digitado e será reproduzido no PDF.</p>
      </div>
    </div>
  );
}

// ─── Step 5: Códigos ──────────────────────────────────────────────────────────
function StepCodigos({ buo, onChange }: { buo: BUO; onChange: (b: Partial<BUO>) => void }) {
  const [search, setSearch] = useState('');

  const filtered = CODIGOS_OCORRENCIA.filter(c =>
    !search || c.descricao.toLowerCase().includes(search.toLowerCase()) || c.codigo.includes(search)
  );

  const toggle = (codigo: string) => {
    const selected = buo.codigosOcorrencia.includes(codigo)
      ? buo.codigosOcorrencia.filter(c => c !== codigo)
      : [...buo.codigosOcorrencia, codigo];
    onChange({ codigosOcorrencia: selected });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B7A90]">
          {buo.codigosOcorrencia.length} código(s) selecionado(s)
        </p>
        {buo.codigosOcorrencia.length > 0 && (
          <button
            onClick={() => onChange({ codigosOcorrencia: [] })}
            className="text-xs text-red-600 hover:text-red-700 font-display font-600"
          >
            Limpar seleção
          </button>
        )}
      </div>

      {buo.codigosOcorrencia.length > 0 && (
        <div className="flex flex-wrap gap-1 p-3 bg-[#F3F5F9] rounded border border-[#CDD5E0]">
          {buo.codigosOcorrencia.map(cod => {
            const c = CODIGOS_OCORRENCIA.find(x => x.codigo === cod);
            return c ? (
              <span
                key={cod}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0E2240] text-white text-xs font-display font-600"
              >
                {c.codigo} — {c.descricao}
                <button onClick={() => toggle(cod)} className="ml-1 text-white/60 hover:text-white">✕</button>
              </span>
            ) : null;
          })}
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar código ou descrição..."
        className="w-full px-3 py-2.5 border border-[#CDD5E0] rounded text-sm focus:outline-none focus:border-[#1A3A5C]"
      />

      <div className="rounded border border-[#CDD5E0] overflow-hidden max-h-80 overflow-y-auto">
        {filtered.map((c, i) => {
          const selected = buo.codigosOcorrencia.includes(c.codigo);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.codigo)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors border-b border-[#EEF2F8] last:border-0 ${
                selected ? 'bg-[#0E2240] text-white' : 'hover:bg-[#F3F5F9] text-[#374151]'
              }`}
            >
              <span className={`font-mono text-xs shrink-0 w-8 ${selected ? 'text-[#B8820A]' : 'text-[#9BAABB]'}`}>{c.codigo}</span>
              <span className="font-display font-500">{c.descricao}</span>
              {selected && <span className="ml-auto text-[#B8820A] font-700">✓</span>}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-[#6B7A90]">Nenhum resultado para "{search}"</p>
        )}
      </div>
    </div>
  );
}

// ─── Step 6: Guarnição ────────────────────────────────────────────────────────
function StepGuarnicao({ buo, onChange }: { buo: BUO; onChange: (b: Partial<BUO>) => void }) {
  const addIntegrante = () => onChange({ guarnicao: [...buo.guarnicao, newIntegrante()] });

  const updateIntegrante = (id: string, field: keyof IntegranteGuarnicao, value: string) => {
    onChange({ guarnicao: buo.guarnicao.map(g => g.id === id ? { ...g, [field]: value } : g) });
  };

  const removeIntegrante = (id: string) => {
    if (!confirm('Remover integrante?')) return;
    onChange({ guarnicao: buo.guarnicao.filter(g => g.id !== id) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B7A90]">{buo.guarnicao.length} integrante(s)</p>
        <button
          onClick={addIntegrante}
          className="flex items-center gap-2 px-4 py-2 rounded font-display font-600 text-sm text-white"
          style={{ background: '#0E2240' }}
        >
          <span className="text-[#B8820A]">+</span> Adicionar Integrante
        </button>
      </div>

      {buo.guarnicao.length === 0 ? (
        <div className="border-2 border-dashed border-[#CDD5E0] rounded p-10 text-center">
          <p className="text-[#6B7A90] text-sm font-display font-500">Guarnição não preenchida</p>
        </div>
      ) : (
        <div className="space-y-2">
          {buo.guarnicao.map((g, i) => (
            <div key={g.id} className="flex items-center gap-3 p-3 rounded border border-[#CDD5E0] bg-white">
              <span className="font-mono text-xs text-[#9BAABB] w-5 shrink-0 text-center">{i + 1}</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                <Input
                  placeholder="Nome completo"
                  value={g.nome}
                  onChange={e => updateIntegrante(g.id, 'nome', e.target.value)}
                />
                <Input
                  placeholder="C.I."
                  value={g.ci ?? ''}
                  onChange={e => updateIntegrante(g.id, 'ci', e.target.value)}
                />
                <Input
                  placeholder="Função (ex.: Comandante, Apoio...)"
                  value={g.funcao}
                  onChange={e => updateIntegrante(g.id, 'funcao', e.target.value)}
                />
              </div>
              <button
                onClick={() => removeIntegrante(g.id)}
                className="shrink-0 w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 7: Policial Responsável ─────────────────────────────────────────────
function StepPolicial({ buo, onChange }: { buo: BUO; onChange: (b: Partial<BUO>) => void }) {
  const p = buo.policial;
  const set = (field: string, value: string) => onChange({ policial: { ...p, [field]: value } });

  return (
    <div className="space-y-4 max-w-xl">
      <div className="p-4 bg-[#F3F5F9] rounded border border-[#CDD5E0]">
        <p className="text-xs font-display font-600 text-[#6B7A90] uppercase tracking-wide mb-3">Identificação Funcional</p>
        <div className="space-y-3">
          <Input label="Nome Completo" required value={p.nome} onChange={e => set('nome', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nº ID. FUNCIONAL" required value={p.identificacaoFuncional} onChange={e => set('identificacaoFuncional', e.target.value)} />
            <Input label="Função" value={p.funcao} onChange={e => set('funcao', e.target.value)} placeholder="Ex.: Soldado PM, Cabo PM..." />
          </div>
          <Textarea label="Observações do policial" rows={3} value={p.observacoes} onChange={e => set('observacoes', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function StepObservacoes({ buo, onChange }: { buo: BUO; onChange: (b: Partial<BUO>) => void }) {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between mb-1">
        <Label text="OBSERVAÇÕES" />
        <span className="text-xs text-[#6B7A90] font-mono">{buo.observacoes.length} caracteres</span>
      </div>
      <textarea
        rows={12}
        value={buo.observacoes}
        onChange={e => onChange({ observacoes: e.target.value })}
        placeholder="Informações adicionais relevantes para o boletim..."
        className="w-full px-4 py-3 border border-[#CDD5E0] rounded text-sm focus:outline-none focus:border-[#1A3A5C] transition-colors resize-none"
      />
      <p className="text-xs text-[#9BAABB]">O conteúdo aparecerá no PDF gerado.</p>
    </div>
  );
}

// ─── Step 8: Recibo Delegacia ─────────────────────────────────────────────────
function StepRecibo({ buo, onChange }: { buo: BUO; onChange: (b: Partial<BUO>) => void }) {
  const r = buo.recibo;
  const set = (field: string, value: string) => onChange({ recibo: { ...r, [field]: value } });

  return (
    <div className="space-y-4 max-w-xl">
      <div className="p-4 bg-[#F3F5F9] rounded border border-[#CDD5E0]">
        <p className="text-xs font-display font-600 text-[#6B7A90] uppercase tracking-wide mb-3">Recibo — Delegacia de Polícia</p>
        <div className="space-y-3">
          <Input label="Nome (responsável pelo recebimento)" value={r.nome} onChange={e => set('nome', e.target.value)} />
          <Input label="Função" value={r.funcao} onChange={e => set('funcao', e.target.value)} placeholder="Ex.: Delegado, Escrivão..." />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data" type="date" value={r.data} onChange={e => set('data', e.target.value)} />
            <Input label="Hora" type="time" value={r.hora} onChange={e => set('hora', e.target.value)} />
          </div>
          <Input label="Assinatura / Identificação" value={r.assinatura} onChange={e => set('assinatura', e.target.value)} placeholder="Nome ou rubrica..." />
          <Textarea label="Observação" rows={3} value={r.observacao} onChange={e => set('observacao', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

// ─── Main BUOForm ─────────────────────────────────────────────────────────────
export default function BUOForm({ buo: initialBuo, onSave, onFinalize, onPreview, onBack }: Props) {
  const [buo, setBuo] = useState<BUO>(initialBuo);
  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleChange = useCallback((patch: Partial<BUO>) => {
    setBuo(prev => {
      const updated = { ...prev, ...patch, status: prev.status === 'RASCUNHO' ? 'EM_PREENCHIMENTO' as const : prev.status };
      setSaveState('saving');
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        onSave(updated);
        setLastSaved(new Date());
        setSaveState('saved');
      }, 800);
      return updated;
    });
  }, [onSave]);

  useEffect(() => {
    setBuo(initialBuo);
  }, [initialBuo.id]);

  useEffect(() => {
    const el = document.querySelector(`[data-step-chip="${step}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [step]);

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!buo.data) errors.push('Data da ocorrência');
    if (!buo.hora) errors.push('Hora da ocorrência');
    if (!buo.tipoOcorrencia) errors.push('Tipo de ocorrência');
    if (!buo.localOcorrencia) errors.push('Local da ocorrência');
    if (!buo.relato.trim()) errors.push('Relato da ocorrência');
    if (!buo.policial.nome) errors.push('Nome do policial responsável');
    if (!buo.policial.identificacaoFuncional) errors.push('Identificação funcional do policial');
    return errors;
  };

  const handleFinalize = () => {
    const errors = validate();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    onSave(buo);
    onFinalize(buo.id);
  };

  const stepProps = { buo, onChange: handleChange };

  const stepComponents = [
    <StepIdentificacao key="1" {...stepProps} />,
    <StepPessoas key="2" {...stepProps} />,
    <StepObjetos key="3" {...stepProps} />,
    <StepRelato key="4" {...stepProps} />,
    <StepCodigos key="5" {...stepProps} />,
    <StepGuarnicao key="6" {...stepProps} />,
    <StepPolicial key="7" {...stepProps} />,
    <StepObservacoes key="8" {...stepProps} />,
    <StepRecibo key="9" {...stepProps} />,
  ];

  const statusColors: Record<string, string> = {
    RASCUNHO: 'bg-gray-100 text-gray-600',
    EM_PREENCHIMENTO: 'bg-blue-50 text-blue-700',
    FINALIZADO: 'bg-emerald-50 text-emerald-700',
    PDF_GERADO: 'bg-purple-50 text-purple-700',
    ARQUIVADO: 'bg-red-50 text-red-700',
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Status compacto */}
      <div className="bg-white border-b border-[#CDD5E0] shrink-0">
        <div className="px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2">
            <p className="font-display font-600 text-[11px] sm:text-xs text-[#0E2240] truncate">
              Cadastro BUO
            </p>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-display font-600 shrink-0 ${statusColors[buo.status]}`}>
              {buo.status === 'EM_PREENCHIMENTO' ? 'Em edição' : buo.status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] sm:text-xs text-[#6B7A90] hidden xs:inline max-w-[140px] truncate">
              {saveState === 'saving' && 'Salvando…'}
              {saveState === 'saved' && lastSaved && `Salvo ✓ ${lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
            </span>
            {saveState === 'saving' && (
              <span className="sm:hidden text-[10px] text-[#6B7A90]">Salvando…</span>
            )}
            {saveState === 'saved' && (
              <span className="sm:hidden text-[10px] text-emerald-600 font-display font-600">Salvo ✓</span>
            )}
            <button
              onClick={() => { onSave(buo); onPreview(buo.id); }}
              className="hidden md:inline-flex min-h-10 px-3 rounded-lg text-xs font-display font-600 text-white bg-[#1A3A5C]"
            >
              Conferir
            </button>
          </div>
        </div>

        {/* Progresso */}
        <div className="buo-progress-bar" aria-hidden>
          <span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        {/* Stepper: desktop vertical-ish labels / mobile chips */}
        <div className="px-2 sm:px-3 py-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5 min-w-max lg:min-w-0 lg:flex-wrap">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <button
                  key={i}
                  data-step-chip={i}
                  onClick={() => setStep(i)}
                  className={`inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-full text-left transition-colors ${
                    active
                      ? 'bg-[#0E2240] text-white'
                      : done
                        ? 'bg-[#E2EAF4] text-[#0E2240]'
                        : 'bg-[#F3F5F9] text-[#6B7A90]'
                  }`}
                >
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-display font-700 ${
                      active ? 'bg-[#B8820A] text-white' : done ? 'bg-[#0E2240] text-white' : 'bg-white text-[#9BAABB]'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={`text-[11px] font-display font-600 ${active ? '' : 'hidden sm:inline'}`}>
                    {s}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="p-3 sm:p-5 pb-28 sm:pb-8 max-w-3xl mx-auto">
          <div className="mb-4 sm:mb-5">
            <p className="text-[11px] font-display font-600 text-[#B8820A] uppercase tracking-wide">
              Etapa {step + 1} de {STEPS.length}
            </p>
            <h2 className="font-display font-700 text-lg sm:text-xl text-[#0E2240] mt-0.5">
              {STEPS[step]}
            </h2>
          </div>

          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 sm:p-4 rounded-xl border border-red-200 bg-red-50">
              <p className="font-display font-700 text-red-700 text-sm mb-2">Campos obrigatórios pendentes:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {validationErrors.map(e => (
                  <li key={e} className="text-sm text-red-600">{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-xl border border-[#CDD5E0] p-3 sm:p-5 shadow-sm">
            {stepComponents[step]}
          </div>
        </div>
      </div>

      {/* Dock inferior — sempre acessível no polegar */}
      <div className="buo-bottom-dock shrink-0 bg-white border-t border-[#CDD5E0] px-3 sm:px-5 pt-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex-1 sm:flex-none min-h-12 px-4 rounded-xl border border-[#CDD5E0] font-display font-600 text-sm text-[#0E2240] disabled:opacity-30 disabled:cursor-not-allowed active:bg-[#F3F5F9]"
          >
            Anterior
          </button>

          <button
            onClick={() => { onSave(buo); onPreview(buo.id); }}
            className="md:hidden min-h-12 min-w-12 px-3 rounded-xl border border-[#CDD5E0] font-display font-600 text-xs text-[#1A3A5C] active:bg-[#F3F5F9]"
            title="Conferir"
          >
            Ver
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex-[1.4] sm:flex-none min-h-12 px-5 rounded-xl font-display font-700 text-sm text-white active:opacity-90"
              style={{ background: '#0E2240' }}
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleFinalize}
              className="flex-[1.6] sm:flex-none min-h-12 px-4 rounded-xl font-display font-700 text-sm text-white active:opacity-90"
              style={{ background: '#059669' }}
            >
              Gerar PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
