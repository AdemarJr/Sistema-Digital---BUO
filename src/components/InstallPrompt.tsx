import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "buo_pwa_install_dismissed";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;

    if (standalone || dismissed === "1") return;

    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // iOS não dispara beforeinstallprompt — mostrar dica após um tempo
    if (ios) {
      const t = setTimeout(() => setVisible(true), 2500);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  return (
    <div
      className="fixed z-[60] left-3 right-3 sm:left-auto sm:right-4 sm:w-[360px] bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:bottom-4"
      role="dialog"
      aria-label="Instalar aplicativo"
    >
      <div className="bg-[#0A1B32] text-white rounded-xl shadow-xl border border-white/10 p-4">
        <div className="flex items-start gap-3">
          <img
            src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
            alt=""
            className="w-11 h-11 rounded-lg object-contain bg-black/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="font-display font-700 text-sm">Instalar BUO Digital</p>
            <p className="text-white/60 text-xs mt-1 leading-relaxed">
              {isIOS && !deferred
                ? "No Safari: Compartilhar → Adicionar à Tela de Início. Use offline no celular."
                : "Adicione à tela inicial para abrir como app, mesmo sem conexão."}
            </p>
            <div className="flex gap-2 mt-3">
              {deferred && (
                <button
                  onClick={() => void install()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-display font-700 bg-[#B8820A] text-white"
                >
                  <Download size={14} /> Instalar
                </button>
              )}
              <button
                onClick={dismiss}
                className="px-3 py-2 rounded-lg text-xs font-display font-600 text-white/70 hover:text-white hover:bg-white/10"
              >
                Agora não
              </button>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
