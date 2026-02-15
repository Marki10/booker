"use client";

import { Suspense } from "react";
import { AppHeader } from "../src/components/AppHeader";
import { FormModal } from "../src/components/FormModal";
import { BookingsView } from "../src/components/BookingsView";
import { Footer } from "../src/components/Footer";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { LoadingSpinner } from "../src/components/LoadingSpinner";

import { useAppController } from "../src/controllers/useAppController";

export default function Home() {
  const {
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
  } = useAppController();

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <AppHeader
          onTitleClick={handleTitleClick}
          onSync={syncWithBackend}
          isSyncing={isSyncing}
          syncStatus={syncStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showForm={showForm}
          onNewBooking={handleNewBooking}
        />

        <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Suspense fallback={<LoadingSpinner text="Loading bookings..." />}>
            {showForm ? (
              <FormModal
                editingBooking={editingBooking}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
              />
            ) : (
              <BookingsView
                viewMode={viewMode}
                bookings={bookings}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onClearDate={handleClearDate}
                onEdit={handleEditBooking}
                onDelete={handleDeleteBooking}
              />
            )}
          </Suspense>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
