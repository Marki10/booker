import type { Booking } from '../types/booking'
import { formatDate, formatTime } from '../utils/dateUtils'
import { Calendar, Clock, Mail, Trash2, Edit, FileText } from 'lucide-react'

interface BookingListProps {
  bookings: Booking[]
  onEdit?: (booking: Booking) => void
  onDelete?: (id: string) => void
}

export const BookingList = ({ bookings, onEdit, onDelete }: BookingListProps) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-6">
          <Calendar className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">No bookings found</p>
        <p className="text-sm text-gray-500">Create your first booking to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking, index) => (
        <div
          key={booking.id}
          className="group bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:border-blue-300 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {booking.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{booking.name}</h3>
                  <p className="text-xs text-gray-500">Booking ID: {booking.id}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{booking.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {formatTime(booking.time)} • {booking.duration} minutes
                  </span>
                </div>
                {booking.notes && (
                  <div className="flex items-start gap-3 mt-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-1.5 bg-pink-50 rounded-lg mt-0.5">
                      <FileText className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{booking.notes}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                  booking.status === 'confirmed'
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                    : booking.status === 'pending'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                      : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                }`}
              >
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-3 pt-5 border-t-2 border-gray-100">
              {onEdit && (
                <button
                  onClick={() => onEdit(booking)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(booking.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

