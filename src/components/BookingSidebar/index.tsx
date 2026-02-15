import type { BookingSidebarProps } from "../../types/interfaces";
import { BookingList } from "../BookingList";

export const BookingSidebar = ({
  bookings,
  selectedDate,
  onClearDate,
  onEdit,
  onDelete,
}: BookingSidebarProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bookings</h2>
        {selectedDate && (
          <button
            onClick={onClearDate}
            className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium min-h-[36px] touch-manipulation"
          >
            Clear
          </button>
        )}
      </div>
      <div className="max-h-[400px] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
        <BookingList bookings={bookings} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};
