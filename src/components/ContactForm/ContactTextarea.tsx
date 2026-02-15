import type { ChangeEvent } from "react";

export interface ContactTextareaProps {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  required?: boolean;
  testId?: string;
}

export const ContactTextarea = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 6,
  error,
  required,
  testId,
}: ContactTextareaProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      id={id}
      name={name || id}
      value={value}
      onChange={handleChange}
      rows={rows}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
        error
          ? "border-red-300 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
      placeholder={placeholder}
      required={required}
      data-testid={testId || id}
    />
  );
};
