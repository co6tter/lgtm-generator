"use client";

import { AlignStartVertical, AlignCenterVertical, AlignEndVertical } from "lucide-react";
import type { TextPosition } from "@/types";

export interface PositionSelectorProps {
  value: TextPosition;
  onChange: (position: TextPosition) => void;
  label?: string;
}

const positionOptions: Array<{
  value: TextPosition;
  label: string;
  icon: typeof AlignStartVertical;
}> = [
  { value: "top", label: "Top", icon: AlignStartVertical },
  { value: "center", label: "Center", icon: AlignCenterVertical },
  { value: "bottom", label: "Bottom", icon: AlignEndVertical },
];

export function PositionSelector({ value, onChange, label }: PositionSelectorProps) {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
      <div className="grid grid-cols-3 gap-2">
        {positionOptions.map((option) => {
          const isSelected = value === option.value;
          const Icon = option.icon;
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
              aria-label={`Align text to ${option.label.toLowerCase()}`}
            >
              <Icon
                className={`mb-2 ${isSelected ? "text-blue-600" : "text-gray-400"}`}
                size={24}
                aria-hidden="true"
              />
              <span
                className={`text-xs font-medium ${isSelected ? "text-blue-700" : "text-gray-500"}`}
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
