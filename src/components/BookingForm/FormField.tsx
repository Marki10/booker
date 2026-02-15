import { memo } from "react";
import type { FormFieldProps } from "../../types/interfaces";

export const FormField = memo(({
  id,
  label,
  icon,
  iconBgColor,
  error,
  required,
  children,
  testId,
  errorTestId,
}: FormFieldProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
      >
        <div className={`p-1.5 ${iconBgColor} rounded-lg`}>{icon}</div>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p
          className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1"
          data-testid={errorTestId || `${testId}-error`}
        >
          <span className="text-red-500">●</span>
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";
