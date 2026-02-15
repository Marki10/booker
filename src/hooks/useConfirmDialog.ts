import { useState, useCallback } from "react";

interface ConfirmDialogState {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: (() => void) | null;
  variant?: "danger" | "warning" | "info";
}

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const showConfirm = useCallback(
    (
      message: string,
      onConfirm: () => void,
      options?: {
        title?: string;
        variant?: "danger" | "warning" | "info";
      },
    ) => {
      setDialogState({
        isOpen: true,
        message,
        onConfirm,
        title: options?.title,
        variant: options?.variant || "danger",
      });
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialogState.onConfirm) {
      dialogState.onConfirm();
    }
    closeDialog();
  }, [dialogState, closeDialog]);

  return {
    dialogState,
    showConfirm,
    closeDialog,
    handleConfirm,
  };
};
