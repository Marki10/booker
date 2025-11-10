import { Cloud, CloudOff, RefreshCw } from "lucide-react";

interface SyncStatusButtonProps {
  onSync: () => void;
  isSyncing: boolean;
  syncStatus: {
    lastSync: string | null;
    pendingSync: boolean;
    backendAvailable: boolean;
  };
}

export const SyncStatusButton = ({
  onSync,
  isSyncing,
  syncStatus,
}: SyncStatusButtonProps) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <button
        onClick={onSync}
        disabled={isSyncing}
        className="relative flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 sm:px-3 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation cursor-pointer"
        title={
          syncStatus.backendAvailable
            ? "Sync with backend"
            : "Backend not available"
        }
        data-testid="sync-button"
      >
        {isSyncing ? (
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
        ) : syncStatus.backendAvailable ? (
          <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        ) : (
          <CloudOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        )}
        {syncStatus.pendingSync && !isSyncing && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white transform translate-x-1/2 -translate-y-1/2"></span>
        )}
      </button>
      {syncStatus.lastSync && (
        <span
          className="text-xs text-gray-500 hidden md:inline-block"
          title={`Last synced: ${new Date(syncStatus.lastSync).toLocaleString()}`}
          data-testid="sync-status"
        >
          {new Date(syncStatus.lastSync).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
