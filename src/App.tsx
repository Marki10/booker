import { AppHeader } from "./components/AppHeader";
import { FormModal } from "./components/FormModal";
import { BookingsView } from "./components/BookingsView";

import { useAppController } from "./controllers/useAppController";

function App() {
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
    <div className="min-h-screen">
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

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
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
      </main>
    </div>
  );
}

export default App;
