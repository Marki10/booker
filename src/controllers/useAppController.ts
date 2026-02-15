import { useState, useCallback, useEffect, useRef } from "react";
import type { Booking, BookingFormData } from "../types/interfaces";
import type { ViewMode } from "../types/booking";
import { useBookings } from "../hooks/useBookings";
import { generateSampleBookings } from "../utils/generateSampleBookings";
import { storageService } from "../services/storageService";
import { useConfirmDialog } from "../hooks/useConfirmDialog";
import { useToast } from "../hooks/useToast";
import { ERROR_MESSAGES } from "../constants/validation";

export const useAppController = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { showSuccess, showError, toasts, removeToast } = useToast();
  const { dialogState, showConfirm, closeDialog, handleConfirm } =
    useConfirmDialog();

  const {
    bookings,
    isSyncing,
    syncStatus,
    syncWithBackend,
    createBooking,
    updateBooking,
    deleteBooking,
    loadBookings,
  } = useBookings();

  const handleCreateBooking = useCallback(
    async (formData: BookingFormData) => {
      try {
        await createBooking(formData);
        setShowForm(false);
        setEditingBooking(null);
        showSuccess(ERROR_MESSAGES.BOOKING_CREATED);
      } catch {
        showError(ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    },
    [createBooking, showSuccess, showError],
  );

  const handleUpdateBooking = useCallback(
    async (formData: BookingFormData) => {
      if (editingBooking) {
        try {
          await updateBooking(editingBooking.id, formData);
          setShowForm(false);
          setEditingBooking(null);
          showSuccess(ERROR_MESSAGES.BOOKING_UPDATED);
        } catch {
          showError(ERROR_MESSAGES.UNKNOWN_ERROR);
        }
      }
    },
    [editingBooking, updateBooking, showSuccess, showError],
  );

  const handleFormSubmit = useCallback(
    (formData: BookingFormData) => {
      if (editingBooking) {
        handleUpdateBooking(formData);
      } else {
        handleCreateBooking(formData);
      }
    },
    [editingBooking, handleCreateBooking, handleUpdateBooking],
  );

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingBooking(null);
  }, []);

  const handleEditBooking = useCallback((booking: Booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  }, []);

  const handleDeleteBooking = useCallback(
    (booking: Booking) => {
      showConfirm(
        ERROR_MESSAGES.DELETE_CONFIRMATION,
        async () => {
          try {
            const wasDeleted = await deleteBooking(booking.id);
            if (wasDeleted) {
              showSuccess(ERROR_MESSAGES.BOOKING_DELETED);
            } else {
              showError(ERROR_MESSAGES.BOOKING_DELETE_FAILED);
            }
          } catch {
            showError(ERROR_MESSAGES.BOOKING_DELETE_FAILED);
          }
        },
        {
          title: "Delete Booking",
          variant: "danger",
        },
      );
    },
    [deleteBooking, showConfirm, showSuccess, showError],
  );

  const handleTitleClick = useCallback(() => {
    setShowForm(false);
    setEditingBooking(null);
    setSelectedDate("");
  }, []);

  const handleNewBooking = useCallback(() => {
    setEditingBooking(null);
    setShowForm(true);
  }, []);

  const handleClearDate = useCallback(() => {
    setSelectedDate("");
  }, []);

  const hasCheckedForSamples = useRef(false);
  useEffect(() => {
    if (typeof window !== "undefined" && "Cypress" in window) return;
    if (hasCheckedForSamples.current) return;
    hasCheckedForSamples.current = true;
    const existingBookings = storageService.getBookings();
    if (existingBookings.length === 0) {
      generateSampleBookings().then(() => {
        loadBookings();
      });
    }
  }, [loadBookings]);

  const handleSyncWithBackend = useCallback(async () => {
    try {
      const result = await syncWithBackend();
      if (result?.success) {
        showSuccess(ERROR_MESSAGES.SYNC_SUCCESS);
      }
    } catch {
      showError(ERROR_MESSAGES.SYNC_FAILED);
    }
  }, [syncWithBackend, showSuccess, showError]);

  return {
    showForm,
    editingBooking,
    selectedDate,
    viewMode,
    setSelectedDate,
    setViewMode,
    bookings,
    isSyncing,
    syncStatus,
    syncWithBackend: handleSyncWithBackend,
    handleFormSubmit,
    handleCancelForm,
    handleEditBooking,
    handleDeleteBooking,
    handleTitleClick,
    handleNewBooking,
    handleClearDate,
    dialogState,
    closeDialog,
    handleConfirm,
    toasts,
    removeToast,
  };
};
