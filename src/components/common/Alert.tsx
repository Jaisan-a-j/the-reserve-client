import { useEffect } from "react";

interface AlertProps {
  isOpen: boolean;
  type?: "success" | "error";
  message: string;
  duration?: number;
  onClose: () => void;
  className?: string;
}

const Alert = ({
  isOpen,
  type = "error",
  message,
  duration = 4000,
  onClose,
  className = "",
}: AlertProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeTimer = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [isOpen, duration, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-20 z-90 flex justify-center px-4 pointer-events-none">
      <div
        className={`pointer-events-auto w-full max-w-3xl rounded-3xl border p-4 shadow-2xl transition-all duration-300 ease-out opacity-100 translate-y-0 ${
          type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
            : "bg-red-50 border-red-200 text-red-900"
        } ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm leading-6">{message}</p>
          <button
            type="button"
            className="rounded-full px-2 py-1 text-sm font-semibold text-current opacity-70 transition hover:opacity-100"
            onClick={onClose}
            aria-label="Close alert"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
