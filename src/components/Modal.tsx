import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}

const sizeClass = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={`relative bg-white w-full ${sizeClass[size]} shadow-2xl flex flex-col
          h-[min(94dvh,100%)] sm:h-auto sm:max-h-[90vh]
          rounded-t-2xl sm:rounded-xl
          pb-[env(safe-area-inset-bottom)]`}
      >
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <span className="w-10 h-1 rounded-full bg-[#CDD5E0]" />
        </div>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#CDD5E0] shrink-0">
          <h2 className="font-display font-700 text-[#0E2240] text-base sm:text-lg pr-2">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="touch-target flex items-center justify-center text-[#6B7A90] hover:text-[#0E2240] hover:bg-[#EEF2F8] rounded-lg transition-colors"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 overscroll-contain">{children}</div>
        {footer && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#CDD5E0] bg-[#F8FAFC] flex flex-col-reverse sm:flex-row sm:justify-end gap-2 shrink-0 [&>button]:min-h-12 [&>button]:w-full sm:[&>button]:w-auto [&>button]:rounded-xl [&>button]:font-display [&>button]:font-600 [&>button]:text-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
