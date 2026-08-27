import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import BUOForm from "./views/BUOForm";
import BUOPreview from "./views/BUOPreview";
import GerarPDF from "./views/GerarPDF";
import { useBuoStore } from "./hooks/useBuoStore";
import { BUO } from "./types/buo";

type ViewType = "form" | "preview" | "pdf";

function pickActiveBuo(buos: BUO[]): BUO | null {
  if (buos.length === 0) return null;
  const drafts = buos.filter(
    (b) => b.status === "RASCUNHO" || b.status === "EM_PREENCHIMENTO",
  );
  const pool = drafts.length > 0 ? drafts : buos;
  return [...pool].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;
}

export default function App() {
  const store = useBuoStore();
  const [view, setView] = useState<ViewType>("form");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let buo = pickActiveBuo(store.buos);
    if (!buo) {
      buo = store.create();
    }
    setSelectedId(buo.id);
    setView("form");
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedBuo = selectedId ? store.get(selectedId) : null;

  const startNew = () => {
    const buo = store.create();
    setSelectedId(buo.id);
    setView("form");
  };

  if (!ready || !selectedBuo) {
    return (
      <div className="h-full flex items-center justify-center text-[#6B7A90] text-sm">
        Carregando formulário...
      </div>
    );
  }

  return (
    <Layout onNovo={startNew} onExportBackup={() => store.exportData()}>
      {view === "form" && (
        <BUOForm
          buo={selectedBuo}
          onSave={(buo) => store.update(buo)}
          onFinalize={(id) => {
            store.finalize(id);
            setView("pdf");
          }}
          onPreview={(id) => {
            store.update(selectedBuo);
            setSelectedId(id);
            setView("preview");
          }}
          onBack={startNew}
        />
      )}

      {view === "preview" && (
        <BUOPreview
          buo={selectedBuo}
          onEdit={() => setView("form")}
          onFinalize={(id) => {
            store.finalize(id);
            setView("pdf");
          }}
          onGeneratePdf={() => setView("pdf")}
          onBack={() => setView("form")}
        />
      )}

      {view === "pdf" && (
        <GerarPDF
          buo={selectedBuo}
          onBack={() => setView("form")}
          onEdit={() => setView("form")}
          onMarkPdfGerado={(id) => store.markPdfGerado(id)}
        />
      )}
    </Layout>
  );
}
