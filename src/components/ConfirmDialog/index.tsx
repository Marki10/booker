"use client";

import { AlertTriangle, X } from "lucide-react";
import type { ConfirmDialogProps } from "../../types/interfaces";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              variant === "danger"
                ? "bg-red-100"
                : variant === "warning"
                  ? "bg-yellow-100"
                  : "bg-blue-100"
            }`}
          >
            <AlertTriangle
              className={`w-6 h-6 ${
                variant === "danger"
                  ? "text-red-600"
                  : variant === "warning"
                    ? "text-yellow-600"
                    : "text-blue-600"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="confirm-dialog-title"
              className="text-lg font-bold text-gray-900 mb-2"
            >
              {title}
            </h3>
            <p
              id="confirm-dialog-description"
              className="text-sm text-gray-600"
            >
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close dialog"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-h-[44px] touch-manipulation"
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors min-h-[44px] touch-manipulation ${variantStyles[variant]}`}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
