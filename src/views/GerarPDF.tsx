import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  Printer,
  RefreshCw,
  Share2,
} from "lucide-react";
import { BUO } from "../types/buo";
import {
  downloadBlob,
  generateBUOPDF,
  openBlobInNewTab,
  printBlobUrl,
} from "../services/pdfService";

interface Props {
  buo: BUO;
  onBack: () => void;
  onEdit: (id: string) => void;
  onMarkPdfGerado: (id: string) => void;
}

export default function GerarPDF({ buo, onBack, onEdit, onMarkPdfGerado }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string; url: string } | null>(
    null,
  );

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      if (result?.url) URL.revokeObjectURL(result.url);
      const generated = await generateBUOPDF(buo);
      setResult(generated);
      onMarkPdfGerado(buo.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao gerar PDF.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buo.id]);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const share = async () => {
    if (!result) return;
    const file = new File([result.blob], result.filename, { type: "application/pdf" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: result.filename,
          text: `BUO ${buo.data || ""}`,
        });
        return;
      } catch {
        /* cancelado */
      }
    }
    downloadBlob(result.blob, result.filename);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 min-h-11 text-sm text-[#6B7A90] hover:text-[#0E2240] font-display font-600"
        >
          <ArrowLeft size={16} /> Voltar ao formulário
        </button>

        <div className="bg-white border border-[#CDD5E0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          {loading && (
            <div className="flex flex-col items-center py-12 gap-3">
              <Loader2 className="animate-spin text-[#0E2240]" size={40} />
              <p className="font-display font-700 text-[#0E2240]">Gerando PDF…</p>
              <p className="text-sm text-[#6B7A90] text-center">
                Montando o documento A4 com as logos oficiais
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="space-y-4">
              <p className="text-red-600 font-display font-700">Erro ao gerar PDF</p>
              <p className="text-sm text-[#6B7A90]">{error}</p>
              <button
                onClick={() => void run()}
                className="inline-flex items-center justify-center gap-2 min-h-12 w-full rounded-xl text-white text-sm font-display font-700"
                style={{ background: "#0E2240" }}
              >
                <RefreshCw size={16} /> Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && result && (
            <>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-emerald-600" size={24} />
                </div>
                <div className="min-w-0">
                  <h1 className="font-display font-700 text-xl sm:text-2xl text-[#0E2240]">
                    PDF pronto
                  </h1>
                  <p className="text-sm text-[#6B7A90] mt-1 break-all">
                    <span className="font-mono text-[#0E2240] text-xs sm:text-sm">
                      {result.filename}
                    </span>
                  </p>
                  <p className="text-sm text-emerald-700 mt-1">Salvo localmente neste dispositivo.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1">
                <button
                  onClick={() => void share()}
                  className="inline-flex items-center justify-center gap-2 min-h-12 rounded-xl text-sm font-display font-700 text-white"
                  style={{ background: "#0E2240" }}
                >
                  <Share2 size={18} /> Compartilhar / Salvar
                </button>
                <button
                  onClick={() => downloadBlob(result.blob, result.filename)}
                  className="inline-flex items-center justify-center gap-2 min-h-12 rounded-xl text-sm font-display font-600 border border-[#CDD5E0] text-[#1A3A5C] active:bg-[#F3F5F9]"
                >
                  <Download size={16} /> Baixar PDF
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openBlobInNewTab(result.url)}
                    className="inline-flex items-center justify-center gap-2 min-h-12 rounded-xl text-sm font-display font-600 border border-[#CDD5E0] text-[#1A3A5C] active:bg-[#F3F5F9]"
                  >
                    <ExternalLink size={16} /> Abrir
                  </button>
                  <button
                    onClick={() => printBlobUrl(result.url)}
                    className="inline-flex items-center justify-center gap-2 min-h-12 rounded-xl text-sm font-display font-600 border border-[#CDD5E0] text-[#1A3A5C] active:bg-[#F3F5F9]"
                  >
                    <Printer size={16} /> Imprimir
                  </button>
                </div>
                <button
                  onClick={() => void run()}
                  className="inline-flex items-center justify-center gap-2 min-h-11 rounded-xl text-sm font-display font-600 text-[#6B7A90] hover:text-[#0E2240]"
                >
                  <RefreshCw size={14} /> Gerar novamente
                </button>
              </div>

              <button
                onClick={() => onEdit(buo.id)}
                className="w-full text-center text-sm font-display font-600 text-[#1A3A5C] min-h-11"
              >
                Voltar e editar BUO
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
