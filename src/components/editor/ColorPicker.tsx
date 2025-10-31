"use client";

import { useState, useId } from "react";
import { Palette } from "lucide-react";

export interface ColorPreset {
  name: string;
  value: string;
}

export interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  presets?: ColorPreset[];
  showInput?: boolean;
}

export function ColorPicker({
  label,
  value,
  onChange,
  presets = [],
  showInput = true,
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value);
  const inputId = useId();

  const handlePresetClick = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {presets.length > 0 && (
        <div className="mb-3 grid grid-cols-8 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              className={`group relative h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                value === preset.value ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundColor: preset.value }}
              aria-label={`Select ${preset.name} color`}
              title={preset.name}
            >
              <span className="sr-only">{preset.name}</span>
            </button>
          ))}
        </div>
      )}

      {showInput && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id={inputId}
              type="text"
              value={customColor}
              onChange={handleInputChange}
              placeholder="#000000"
              maxLength={7}
              className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
              aria-label={label || "Custom color"}
            />
            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              <Palette className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          </div>
          <label
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:scale-110"
            style={{ backgroundColor: customColor }}
            aria-label="Pick custom color"
          >
            <input
              type="color"
              value={customColor}
              onChange={handleColorInputChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Color picker"
            />
            <span className="sr-only">Pick custom color</span>
          </label>
        </div>
      )}
    </div>
  );
}
