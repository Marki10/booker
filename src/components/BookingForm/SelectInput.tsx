import type { ChangeEvent } from "react";
import type { SelectInputProps } from "../../types/interfaces";

export const SelectInput = ({
  id,
  value,
  onChange,
  options,
  error,
  required,
  testId,
}: SelectInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const numericValue = !isNaN(Number(newValue)) ? Number(newValue) : newValue;
    onChange(numericValue);
  };

  return (
    <select
      id={id}
      value={value}
      onChange={handleChange}
      className={`w-full px-4 py-3.5 sm:py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-offset-1 sm:focus:ring-offset-2 transition-all duration-200 cursor-pointer touch-manipulation ${
        error
          ? "border-red-400 focus:ring-red-500 focus:border-red-500"
          : "border-gray-200 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300"
      }`}
      required={required}
      data-testid={testId || id}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
