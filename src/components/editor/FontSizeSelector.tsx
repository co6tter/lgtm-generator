"use client";

import { Type } from "lucide-react";
import type { FontSize } from "@/types";

export interface FontSizeSelectorProps {
  value: FontSize;
  onChange: (size: FontSize) => void;
  label?: string;
}

const fontSizeOptions: Array<{ value: FontSize; label: string; example: string }> = [
  { value: "small", label: "Small", example: "Aa" },
  { value: "medium", label: "Medium", example: "Aa" },
  { value: "large", label: "Large", example: "Aa" },
];

const sizeClasses: Record<FontSize, string> = {
  small: "text-base",
  medium: "text-2xl",
  large: "text-4xl",
};

export function FontSizeSelector({ value, onChange, label }: FontSizeSelectorProps) {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
      <div className="grid grid-cols-3 gap-2">
        {fontSizeOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              aria-pressed={isSelected}
              aria-label={`Select ${option.label} font size`}
            >
              <Type
                className={`mb-2 ${isSelected ? "text-blue-600" : "text-gray-400"}`}
                size={option.value === "small" ? 16 : option.value === "medium" ? 20 : 24}
                aria-hidden="true"
              />
              <span
                className={`font-bold ${sizeClasses[option.value]} ${isSelected ? "text-blue-700" : "text-gray-600"}`}
              >
                {option.example}
              </span>
              <span
                className={`mt-1 text-xs font-medium ${isSelected ? "text-blue-700" : "text-gray-500"}`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
