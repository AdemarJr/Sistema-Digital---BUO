import { FilePlus2, Download, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import InstallPrompt from "./InstallPrompt";

interface LayoutProps {
  children: React.ReactNode;
  onNovo?: () => void;
  onExportBackup?: () => void;
  showActions?: boolean;
}

export default function Layout({
  children,
  onNovo,
  onExportBackup,
  showActions = true,
}: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="flex flex-col h-full overflow-hidden app-shell"
      style={{ background: "var(--background)" }}
    >
      <header
        className="shrink-0 border-b border-white/10 pt-[env(safe-area-inset-top)]"
        style={{ background: "#0A1B32" }}
      >
        <div className="flex items-center justify-between gap-2 px-3 sm:px-5 h-14 sm:h-16">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={`${import.meta.env.BASE_URL}logos/pmam-ft.png`}
              alt="PMAM Força Tática"
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display font-700 text-white text-[13px] sm:text-sm leading-tight truncate">
                BUO Digital
              </p>
              <p className="text-[10px] text-white/40 truncate hidden xs:block sm:block">
                Força Tática · uso em campo
              </p>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-1.5 shrink-0">
              {onExportBackup && (
                <button
                  onClick={onExportBackup}
                  title="Exportar backup"
                  className="hidden sm:inline-flex items-center gap-1.5 min-h-11 px-3 rounded-lg text-xs font-display font-600 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Download size={16} />
                  Backup
                </button>
              )}
              {onNovo && (
                <button
                  onClick={onNovo}
                  className="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-lg text-xs font-display font-700 text-white"
                  style={{ background: "#B8820A" }}
                >
                  <FilePlus2 size={16} />
                  <span className="hidden sm:inline">Novo BUO</span>
                  <span className="sm:hidden">Novo</span>
                </button>
              )}
              <div className="relative sm:hidden">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  aria-label="Mais opções"
                >
                  <MoreHorizontal size={20} />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-white shadow-xl border border-[#CDD5E0] overflow-hidden">
                      {onExportBackup && (
                        <button
                          onClick={() => {
                            onExportBackup();
                            setMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#0E2240] font-display font-600 hover:bg-[#F3F5F9] text-left"
                        >
                          <Download size={16} /> Exportar backup
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden min-w-0 flex flex-col">{children}</main>

      <InstallPrompt />
    </div>
  );
}
