import type { Booking } from '../../types/booking'
import { BookingCalendar } from '../BookingCalendar'
import { BookingList } from '../BookingList'
import { BookingSidebar } from '../BookingSidebar'
import { DateFilter } from '../DateFilter'

interface BookingsViewProps {
  viewMode: 'list' | 'calendar'
  bookings: Booking[]
  selectedDate: string
  onDateSelect: (date: string) => void
  onClearDate: () => void
  onEdit: (booking: Booking) => void
  onDelete: (id: string) => void
}

export const BookingsView = ({
  viewMode,
  bookings,
  selectedDate,
  onDateSelect,
  onClearDate,
  onEdit,
  onDelete,
}: BookingsViewProps) => {
  const filteredBookings = selectedDate
    ? bookings.filter((booking) => booking.date === selectedDate)
    : bookings

  if (viewMode === 'calendar') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <BookingCalendar
            bookings={bookings}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        </div>
        <div className="order-1 lg:order-2">
          <BookingSidebar
            bookings={filteredBookings}
            selectedDate={selectedDate || null}
            onClearDate={onClearDate}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <DateFilter selectedDate={selectedDate} onClear={onClearDate} />
      <BookingList bookings={filteredBookings} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}

