import { useState } from 'react'
import type { Booking, BookingFormData } from './types/booking'
import { useBookings } from './hooks/useBookings'
import { bookingToFormData } from './utils/bookingUtils'
import { AppHeader } from './components/AppHeader'
import { FormModal } from './components/FormModal'
import { BookingsView } from './components/BookingsView'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const {
    bookings,
    isSyncing,
    syncStatus,
    syncWithBackend,
    createBooking,
    updateBooking,
    deleteBooking,
  } = useBookings()

  const handleCreateBooking = async (formData: BookingFormData) => {
    await createBooking(formData)
    setShowForm(false)
    setEditingBooking(null)
  }

  const handleUpdateBooking = async (formData: BookingFormData) => {
    if (editingBooking) {
      await updateBooking(editingBooking.id, formData)
      setShowForm(false)
      setEditingBooking(null)
    }
  }

  const handleFormSubmit = (formData: BookingFormData) => {
    if (editingBooking) {
      handleUpdateBooking(formData)
    } else {
      handleCreateBooking(formData)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingBooking(null)
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
    setShowForm(true)
  }

  const handleDeleteBooking = async (id: string) => {
    await deleteBooking(id)
  }

  const handleTitleClick = () => {
    setShowForm(false)
    setEditingBooking(null)
    setSelectedDate('')
  }

  const handleNewBooking = () => {
    setEditingBooking(null)
    setShowForm(true)
  }

  const handleClearDate = () => {
    setSelectedDate('')
  }

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
            editingBooking={editingBooking ? bookingToFormData(editingBooking) : null}
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
  )
}

export default App
