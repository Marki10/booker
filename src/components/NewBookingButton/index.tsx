import { Plus } from "lucide-react";

interface NewBookingButtonProps {
  onClick: () => void;
}

export const NewBookingButton = ({ onClick }: NewBookingButtonProps) => {
  return (
    <button
      onClick={onClick}
      data-testid="new-booking-button"
      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-h-[44px] text-sm sm:text-base touch-manipulation cursor-pointer flex-1 sm:flex-initial"
    >
      <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
      <span className="hidden sm:inline">New Booking</span>
      <span className="sm:hidden">New</span>
    </button>
  );
};
