import { useRef, useState } from "react";
import {
  FilePlus2,
  FileText,
  FolderOpen,
  Download,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { BUO, StatusBUO } from "../types/buo";
import { formatDateBR } from "../utils/date";
import { statusLabel } from "../utils/formatters";

interface Props {
  buos: BUO[];
  onNavigate: (view: string, id?: string) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => Promise<{ imported: number; total: number }>;
}

const STATUS_COLORS: Record<StatusBUO, string> = {
  RASCUNHO: "bg-gray-100 text-gray-600",
  EM_PREENCHIMENTO: "bg-blue-50 text-blue-700",
  FINALIZADO: "bg-emerald-50 text-emerald-700",
  PDF_GERADO: "bg-purple-50 text-purple-700",
  ARQUIVADO: "bg-red-50 text-red-700",
};

export default function Dashboard({ buos, onNavigate, onDelete, onExport, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "rascunho" | "finalizado">("all");

  const rascunhos = buos.filter(
    (b) => b.status === "RASCUNHO" || b.status === "EM_PREENCHIMENTO",
  );
  const finalizados = buos.filter(
    (b) => b.status === "FINALIZADO" || b.status === "PDF_GERADO",
  );

  const list =
    filter === "rascunho"
      ? rascunhos
      : filter === "finalizado"
        ? finalizados
        : [...buos].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    const ok = confirm(
      "Os dados atuais poderão ser mesclados com os dados do backup. Continuar?",
    );
    if (!ok) return;
    try {
      const result = await onImport(file);
      setImportMsg(
        `Backup importado: ${result.imported} registro(s) no arquivo · ${result.total} no total após mesclagem.`,
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Falha ao importar backup.");
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;
    onDelete(id);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-700 text-2xl sm:text-3xl text-[#0E2240]">
            Boletim Único de Ocorrência
          </h1>
          <p className="text-[#6B7A90] text-sm mt-1">
            Sistema Digital de Registro — BUO
          </p>
        </div>
        <button
          onClick={() => onNavigate("form-new")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded font-display font-600 text-sm text-white"
          style={{ background: "#0E2240" }}
        >
          <FilePlus2 size={16} className="text-[#B8820A]" />
          + NOVO BUO
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate("form-new")}
          className="bg-white border border-[#CDD5E0] rounded p-5 text-left hover:border-[#0E2240] transition-colors group"
        >
          <FilePlus2 className="text-[#B8820A] mb-3" size={28} />
          <p className="font-display font-700 text-[#0E2240]">Novo BUO</p>
          <p className="text-xs text-[#6B7A90] mt-1">Iniciar preenchimento digital</p>
        </button>
        <button
          onClick={() => setFilter("rascunho")}
          className={`bg-white border rounded p-5 text-left transition-colors ${
            filter === "rascunho" ? "border-[#0E2240] ring-1 ring-[#0E2240]/20" : "border-[#CDD5E0] hover:border-[#0E2240]"
          }`}
        >
          <FolderOpen className="text-[#D97706] mb-3" size={28} />
          <p className="font-display font-700 text-[#0E2240]">Rascunhos</p>
          <p className="text-2xl font-display font-800 text-[#0E2240] mt-1">{rascunhos.length}</p>
        </button>
        <button
          onClick={() => setFilter("finalizado")}
          className={`bg-white border rounded p-5 text-left transition-colors ${
            filter === "finalizado" ? "border-[#0E2240] ring-1 ring-[#0E2240]/20" : "border-[#CDD5E0] hover:border-[#0E2240]"
          }`}
        >
          <FileText className="text-[#059669] mb-3" size={28} />
          <p className="font-display font-700 text-[#0E2240]">BUOs finalizados</p>
          <p className="text-2xl font-display font-800 text-[#0E2240] mt-1">{finalizados.length}</p>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded border border-[#CDD5E0] font-display font-600 text-[#1A3A5C] hover:bg-white bg-white"
          >
            <Download size={14} /> EXPORTAR BACKUP
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded border border-[#CDD5E0] font-display font-600 text-[#1A3A5C] hover:bg-white bg-white"
          >
            <Upload size={14} /> IMPORTAR BACKUP
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              void handleImport(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
        {filter !== "all" && (
          <button
            onClick={() => setFilter("all")}
            className="text-xs font-display font-600 text-[#6B7A90] hover:text-[#0E2240]"
          >
            Ver todos os registros
          </button>
        )}
      </div>

      {importMsg && (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-4 py-3">
          {importMsg}
        </div>
      )}

      <div className="bg-white rounded border border-[#CDD5E0]">
        <div className="px-5 py-4 border-b border-[#CDD5E0] flex items-center justify-between">
          <h2 className="font-display font-700 text-[#0E2240]">MEUS REGISTROS</h2>
          <span className="text-xs text-[#6B7A90]">{list.length} registro(s)</span>
        </div>

        {list.length === 0 ? (
          <div className="py-14 text-center">
            <p className="font-display font-600 text-[#0E2240]">Nenhum registro nesta lista</p>
            <p className="text-sm text-[#6B7A90] mt-1">Clique em + NOVO BUO para começar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#CDD5E0]">
                  {["Nº BUO", "Data", "Tipo", "Local", "Status", "Ações"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[#6B7A90] font-display font-600 text-xs uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((buo) => {
                  const isDraft =
                    buo.status === "RASCUNHO" || buo.status === "EM_PREENCHIMENTO";
                  return (
                    <tr key={buo.id} className="border-b border-[#EEF2F8] hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-mono text-xs text-[#0E2240]">{buo.numeroBuo}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDateBR(buo.data)}</td>
                      <td className="px-4 py-3 max-w-[140px] truncate">{buo.tipoOcorrencia || "—"}</td>
                      <td className="px-4 py-3 max-w-[160px] truncate">{buo.localOcorrencia || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-display font-600 ${STATUS_COLORS[buo.status]}`}
                        >
                          {statusLabel(buo.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {isDraft && (
                            <button
                              onClick={() => onNavigate("form", buo.id)}
                              className="px-2 py-1 text-xs rounded bg-[#EEF2F8] text-[#1A3A5C] font-display font-600"
                            >
                              Continuar
                            </button>
                          )}
                          <button
                            onClick={() => onNavigate("preview", buo.id)}
                            className="px-2 py-1 text-xs rounded bg-[#EEF2F8] text-[#1A3A5C] font-display font-600"
                          >
                            Visualizar
                          </button>
                          <button
                            onClick={() => onNavigate("form", buo.id)}
                            className="px-2 py-1 text-xs rounded bg-[#EEF2F8] text-[#1A3A5C] font-display font-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => onNavigate("pdf", buo.id)}
                            className="px-2 py-1 text-xs rounded bg-[#0E2240] text-white font-display font-600"
                          >
                            Gerar PDF
                          </button>
                          <button
                            onClick={() => handleDelete(buo.id)}
                            className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 font-display font-600"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex gap-3 items-start rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
        <div>
          <p>
            Os dados deste sistema são armazenados localmente neste navegador através do
            LocalStorage. Limpar os dados do navegador poderá apagar os registros salvos.
          </p>
          <p className="text-xs mt-1 text-amber-800/80">
            Os registros são armazenados localmente neste dispositivo/navegador. Use EXPORTAR
            BACKUP regularmente.
          </p>
        </div>
      </div>
    </div>
  );
}
