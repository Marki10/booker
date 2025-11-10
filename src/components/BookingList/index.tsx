import type { Booking } from "../../types/booking";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { Calendar, Clock, Mail, Trash2, Edit, FileText } from "lucide-react";

interface BookingListProps {
  bookings: Booking[];
  onEdit?: (booking: Booking) => void;
  onDelete?: (id: string) => void;
}

export const BookingList = ({
  bookings,
  onEdit,
  onDelete,
}: BookingListProps) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-6">
          <Calendar className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">
          No bookings found
        </p>
        <p className="text-sm text-gray-500">
          Create your first booking to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4" data-testid="booking-list">
      {bookings.map((booking, index) => (
        <div
          key={booking.id}
          className="group bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-2xl hover:border-blue-300 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms` }}
          data-testid="booking-item"
        >
          <div className="flex justify-between items-start mb-4 sm:mb-5 gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-base sm:text-lg">
                    {booking.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {booking.name}
                  </h3>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Booking ID: {booking.id}
                  </p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-sm">
                  <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs sm:text-sm truncate">
                    {booking.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-sm">
                  <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs sm:text-sm">
                    {formatDate(booking.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-sm">
                  <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs sm:text-sm">
                    {formatTime(booking.time)} • {booking.duration} min
                  </span>
                </div>
                {booking.notes && (
                  <div className="flex items-start gap-2 sm:gap-3 mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 rounded-xl">
                    <div className="p-1 sm:p-1.5 bg-pink-50 rounded-lg mt-0.5 flex-shrink-0">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700 flex-1 break-words">
                      {booking.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-2 sm:ml-4 flex-shrink-0">
              <span
                className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm ${
                  booking.status === "confirmed"
                    ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                    : booking.status === "pending"
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                      : "bg-gradient-to-r from-red-400 to-red-600 text-white"
                }`}
              >
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-5 border-t-2 border-gray-100">
              {onEdit && (
                <button
                  onClick={() => onEdit(booking)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px] touch-manipulation cursor-pointer"
                  data-testid="edit-booking-button"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(booking.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px] touch-manipulation cursor-pointer"
                  data-testid="delete-booking-button"
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
  );
};
