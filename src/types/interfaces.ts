// ============================================================================
// Booking-related interfaces
// ============================================================================

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DayAvailability {
  date: string;
  available: boolean;
  slots: TimeSlot[];
}

// ============================================================================
// Service-related interfaces
// ============================================================================

export interface SyncMetadata {
  lastSync: string | null;
  lastSyncId: string | null;
  pendingSync: boolean;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// ============================================================================
// Validation-related interfaces
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// Controller and View types
// ============================================================================

export type ViewMode = "list" | "calendar";

// ============================================================================
// Component Props interfaces
// ============================================================================

export interface BookingFormProps {
  onSubmit: (booking: BookingFormData) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<BookingFormData>;
  excludeBookingId?: string;
}

export interface FormModalProps {
  editingBooking: (Partial<BookingFormData> & { id?: string }) | null;
  onSubmit: (formData: BookingFormData) => void | Promise<void>;
  onCancel: () => void;
}

export interface BookingCalendarProps {
  bookings: Booking[];
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
}

export interface ViewModeToggleProps {
  viewMode: "list" | "calendar";
  onViewModeChange: (mode: "list" | "calendar") => void;
}

export interface SyncStatusButtonProps {
  onSync: () => void;
  isSyncing: boolean;
  syncStatus: {
    lastSync: string | null;
    pendingSync: boolean;
    backendAvailable: boolean;
  };
}

export interface NewBookingButtonProps {
  onClick: () => void;
}

export interface DateFilterProps {
  selectedDate: string;
  onClear: () => void;
}

export interface BookingsViewProps {
  viewMode: "list" | "calendar";
  bookings: Booking[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClearDate: () => void;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

export interface BookingSidebarProps {
  bookings: Booking[];
  selectedDate: string | null;
  onClearDate: () => void;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

export interface BookingListProps {
  bookings: Booking[];
  onEdit?: (booking: Booking) => void;
  onDelete?: (id: string) => void;
}

export interface AppHeaderProps {
  onTitleClick: () => void;
  onSync: () => void;
  isSyncing: boolean;
  syncStatus: {
    lastSync: string | null;
    pendingSync: boolean;
    backendAvailable: boolean;
  };
  viewMode: "list" | "calendar";
  onViewModeChange: (mode: "list" | "calendar") => void;
  showForm: boolean;
  onNewBooking: () => void;
}
