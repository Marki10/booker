import { useState, useCallback } from "react";
import type { Toast } from "../types/interfaces";

let toastIdCounter = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration = 5000) => {
      const id = `toast-${++toastIdCounter}`;
      const newToast: Toast = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      return showToast(message, "success", duration);
    },
    [showToast],
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      return showToast(message, "error", duration);
    },
    [showToast],
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      return showToast(message, "warning", duration);
    },
    [showToast],
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      return showToast(message, "info", duration);
    },
    [showToast],
  );

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
