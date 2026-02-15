"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import type { ToastProps } from "../../types/interfaces";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const iconStyles = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

export const Toast = ({
  id,
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) => {
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg animate-in slide-in-from-right fade-in min-w-[300px] max-w-md ${styles[type]}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconStyles[type]}`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity rounded"
        aria-label="Close notification"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
