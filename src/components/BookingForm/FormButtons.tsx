import type { FormButtonsProps } from "../../types/interfaces";

export const FormButtons = ({
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  isSubmitting = false,
  onCancel,
}: FormButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
      <button
        type="submit"
        formNoValidate
        disabled={isSubmitting}
        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 sm:py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-h-[48px] text-base touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="booking-form-submit"
      >
        {submitLabel}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3.5 sm:py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300 min-h-[48px] text-base touch-manipulation"
          data-testid="booking-form-cancel"
        >
          {cancelLabel}
        </button>
      )}
    </div>
  );
};
