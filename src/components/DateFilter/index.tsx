import type { DateFilterProps } from "../../types/interfaces";

export const DateFilter = ({ selectedDate, onClear }: DateFilterProps) => {
  if (!selectedDate) return null;

  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 p-3 sm:p-4">
      <p className="text-xs sm:text-sm text-gray-600">
        Showing bookings for:{" "}
        <span className="font-semibold text-gray-900">{selectedDate}</span>
      </p>
      <button
        onClick={onClear}
        className="text-xs sm:text-sm px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium min-h-[36px] touch-manipulation w-full sm:w-auto"
      >
        Clear filter
      </button>
    </div>
  );
};
