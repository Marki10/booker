import { useState, useEffect } from 'react'
import type { Booking, BookingFormData } from './types/booking'
import { bookingService } from './services/bookingService'
import { BookingForm } from './components/BookingForm'
import { BookingList } from './components/BookingList'
import { BookingCalendar } from './components/BookingCalendar'
import { Calendar, Plus, X } from 'lucide-react'

function App() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = () => {
    const allBookings = bookingService.getAllBookings()
    setBookings(allBookings)
  }

  const handleCreateBooking = (formData: BookingFormData) => {
    bookingService.createBooking(formData)
    loadBookings()
    setShowForm(false)
    setEditingBooking(null)
  }

  const handleUpdateBooking = (formData: BookingFormData) => {
    if (editingBooking) {
      bookingService.updateBooking(editingBooking.id, formData)
      loadBookings()
      setShowForm(false)
      setEditingBooking(null)
    }
  }

  const handleDeleteBooking = (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      bookingService.deleteBooking(id)
      loadBookings()
    }
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
    setShowForm(true)
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

  const handleTitleClick = () => {
    setShowForm(false)
    setEditingBooking(null)
    setSelectedDate('')
  }

  const filteredBookings = selectedDate
    ? bookings.filter((booking) => booking.date === selectedDate)
    : bookings

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleTitleClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                  Booking App
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">Manage your appointments</p>
              </div>
            </button>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    viewMode === 'calendar'
                      ? 'bg-white text-blue-600 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Calendar
                </button>
              </div>
              {!showForm && (
                <button
                  onClick={() => {
                    setEditingBooking(null)
                    setShowForm(true)
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  New Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {editingBooking ? 'Edit Booking' : 'Create New Booking'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingBooking ? 'Update your booking details' : 'Fill in the form to create a new booking'}
                </p>
              </div>
              <button
                onClick={handleCancelForm}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:rotate-90"
                aria-label="Close form"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <BookingForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              initialData={
                editingBooking
                  ? {
                      name: editingBooking.name,
                      email: editingBooking.email,
                      date: editingBooking.date,
                      time: editingBooking.time,
                      duration: editingBooking.duration,
                      notes: editingBooking.notes,
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <>
            {viewMode === 'calendar' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <BookingCalendar
                    bookings={bookings}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />
                </div>
                <div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
                      {selectedDate && (
                        <button
                          onClick={() => setSelectedDate('')}
                          className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                        >
                          Clear filter
                        </button>
                      )}
                    </div>
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                      <BookingList
                        bookings={filteredBookings}
                        onEdit={handleEditBooking}
                        onDelete={handleDeleteBooking}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {selectedDate && (
                  <div className="mb-6 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 p-4">
                    <p className="text-sm text-gray-600">
                      Showing bookings for: <span className="font-semibold text-gray-900">{selectedDate}</span>
                    </p>
                    <button
                      onClick={() => setSelectedDate('')}
                      className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                    >
                      Clear filter
                    </button>
                  </div>
                )}
                <BookingList
                  bookings={filteredBookings}
                  onEdit={handleEditBooking}
                  onDelete={handleDeleteBooking}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
