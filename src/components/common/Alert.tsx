import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    if (!isOpen) return;

    const closeTimer = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [isOpen, duration, onClose]);

  const isSuccess = type === "success";

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -30, x: "-50%", scale: 0.95 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          className="fixed top-6 left-1/2 z-[100] w-full max-w-md px-4 pointer-events-none"
        >
          <div
            className={`pointer-events-auto flex min-w-[320px] items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-sm transition-all ${
              isSuccess
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-100/50"
                : "bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-100/50"
            } ${className}`}
            role="status"
            aria-live="polite"
          >
            <div className={`mt-0.5 shrink-0 ${isSuccess ? "text-emerald-600" : "text-rose-600"}`}>
              {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">
                {isSuccess ? "Success" : "Opps!"}
              </p>
              <p className="text-sm font-medium leading-relaxed">{message}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`shrink-0 rounded-lg p-1 transition-colors ${
                isSuccess 
                  ? "text-emerald-600 hover:bg-emerald-100 active:bg-emerald-200" 
                  : "text-rose-600 hover:bg-rose-100 active:bg-rose-200"
              }`}
              aria-label="Close alert"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;