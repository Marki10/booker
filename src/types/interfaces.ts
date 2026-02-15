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

export interface SyncMetadata {
  lastSync: string | null;
  lastSyncId: string | null;
  pendingSync: boolean;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

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
  onDelete: (booking: Booking) => void;
}

export interface BookingSidebarProps {
  bookings: Booking[];
  selectedDate: string | null;
  onClearDate: () => void;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

export interface BookingListProps {
  bookings: Booking[];
  onEdit?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
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

export interface FormFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconBgColor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  testId?: string;
  errorTestId?: string;
}

export interface TextInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url";
  testId?: string;
  min?: string;
  type?: "text" | "email" | "date";
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectInputProps {
  id: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  testId?: string;
}

export interface TextareaInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  testId?: string;
}

export interface FormButtonsProps {
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

export interface ToastProps extends Toast {
  onClose: (id: string) => void;
}
