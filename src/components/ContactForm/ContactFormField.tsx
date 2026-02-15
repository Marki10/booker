import type { ReactNode } from "react";

export interface ContactFormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  testId?: string;
}

export const ContactFormField = ({
  id,
  label,
  error,
  required,
  children,
  testId,
}: ContactFormFieldProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
          data-testid={testId ? `${testId}-error` : `${id}-error`}
        >
          <span className="text-red-500">●</span>
          {error}
        </p>
      )}
    </div>
  );
};
