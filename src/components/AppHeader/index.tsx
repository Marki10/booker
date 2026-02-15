import { Calendar } from "lucide-react";
import type { AppHeaderProps } from "../../types/interfaces";
import { SyncStatusButton } from "../SyncStatusButton";
import { ViewModeToggle } from "../ViewModeToggle";
import { NewBookingButton } from "../NewBookingButton";

export const AppHeader = ({
  onTitleClick,
  onSync,
  isSyncing,
  syncStatus,
  viewMode,
  onViewModeChange,
  showForm,
  onNewBooking,
}: AppHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <button
            onClick={onTitleClick}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer group self-start"
          >
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                Booking App
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                Manage your appointments
              </p>
            </div>
          </button>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
            <SyncStatusButton
              onSync={onSync}
              isSyncing={isSyncing}
              syncStatus={syncStatus}
            />
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
            {!showForm && <NewBookingButton onClick={onNewBooking} />}
          </div>
        </div>
      </div>
    </header>
  );
};
