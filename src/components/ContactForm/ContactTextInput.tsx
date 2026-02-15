import type { ChangeEvent } from "react";

export interface ContactTextInputProps {
  id: string;
  name?: string;
  type?: "text" | "email" | "tel";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  testId?: string;
}

export const ContactTextInput = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
  autoComplete,
  testId,
}: ContactTextInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type={type}
      id={id}
      name={name || id}
      value={value}
      onChange={handleChange}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
        error
          ? "border-red-300 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      data-testid={testId || id}
    />
  );
};
