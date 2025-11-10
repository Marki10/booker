interface ViewModeToggleProps {
  viewMode: "list" | "calendar";
  onViewModeChange: (mode: "list" | "calendar") => void;
}

export const ViewModeToggle = ({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) => {
  return (
    <div
      className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 shadow-inner gap-2"
      data-testid="view-mode-toggle"
    >
      <button
        onClick={() => onViewModeChange("list")}
        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[44px] touch-manipulation cursor-pointer ${
          viewMode === "list"
            ? "bg-white text-blue-600 shadow-md scale-105"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
        data-testid="view-mode-list"
      >
        List
      </button>
      <button
        onClick={() => onViewModeChange("calendar")}
        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[44px] touch-manipulation cursor-pointer ${
          viewMode === "calendar"
            ? "bg-white text-blue-600 shadow-md scale-105"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
        data-testid="view-mode-calendar"
      >
        Calendar
      </button>
    </div>
  );
};
