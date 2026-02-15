import { memo, type ChangeEvent } from "react";
import type { TextareaInputProps } from "../../types/interfaces";

export const TextareaInput = memo(({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  testId,
}: TextareaInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      id={id}
      value={value}
      onChange={handleChange}
      rows={rows}
      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 resize-none touch-manipulation"
      placeholder={placeholder}
      data-testid={testId || id}
    />
  );
});

TextareaInput.displayName = "TextareaInput";
