import { useState, useCallback, useEffect } from "react";
import type { Booking, BookingFormData } from "../types/booking";
import { useBookings } from "../hooks/useBookings";
import { generateSampleBookings } from "../utils/generateSampleBookings";

export type ViewMode = "list" | "calendar";

export const useAppController = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

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
      await createBooking(formData);
      setShowForm(false);
      setEditingBooking(null);
    },
    [createBooking],
  );

  const handleUpdateBooking = useCallback(
    async (formData: BookingFormData) => {
      if (editingBooking) {
        await updateBooking(editingBooking.id, formData);
        setShowForm(false);
        setEditingBooking(null);
      }
    },
    [editingBooking, updateBooking],
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
    async (id: string) => {
      await deleteBooking(id);
    },
    [deleteBooking],
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

  // Generate sample bookings on first load if no bookings exist
  useEffect(() => {
    if (bookings.length === 0) {
      generateSampleBookings().then(() => {
        // Reload bookings after generating samples
        loadBookings();
      });
    }
  }, []); // Only run once on mount

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
    syncWithBackend,
    handleFormSubmit,
    handleCancelForm,
    handleEditBooking,
    handleDeleteBooking,
    handleTitleClick,
    handleNewBooking,
    handleClearDate,
  };
};
