"use client";

import { Check } from "lucide-react";
import type { TemplateType } from "@/types";
import { TEMPLATES } from "@/constants/templates";

export interface TemplateSelectorProps {
  value: TemplateType;
  onChange: (template: TemplateType) => void;
  label?: string;
}

export function TemplateSelector({ value, onChange, label }: TemplateSelectorProps) {
  const templates = Object.values(TEMPLATES);

  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {templates.map((template) => {
          const isSelected = value === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={`group relative flex flex-col items-center rounded-lg border-2 p-3 transition-all hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              aria-pressed={isSelected}
              aria-label={`Select ${template.name} template`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 rounded-full bg-blue-500 p-0.5">
                  <Check className="h-3 w-3 text-white" aria-hidden="true" />
                </div>
              )}
              <div
                className="mb-2 h-16 w-full rounded-md"
                style={{
                  background: template.defaultConfig.backgroundGradient
                    ? `linear-gradient(${template.defaultConfig.backgroundGradient.angle}deg, ${template.defaultConfig.backgroundGradient.colors.join(", ")})`
                    : template.defaultConfig.backgroundColor,
                }}
                aria-hidden="true"
              />
              <div className="text-center">
                <p
                  className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-gray-900"}`}
                >
                  {template.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{template.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
