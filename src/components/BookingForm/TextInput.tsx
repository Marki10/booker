import type { ChangeEvent } from "react";
import type { TextInputProps } from "../../types/interfaces";

export const TextInput = ({
  id,
  value,
  onChange,
  placeholder,
  error,
  required,
  autoComplete,
  inputMode,
  testId,
  min,
  type = "text",
}: TextInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={handleChange}
      className={`w-full px-4 py-3.5 sm:py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 transition-all duration-200 touch-manipulation ${
        error
          ? "border-red-400 focus:ring-red-500 focus:border-red-500"
          : "border-gray-200 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300"
      }`}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      inputMode={inputMode}
      min={min}
      data-testid={testId || id}
    />
  );
};
