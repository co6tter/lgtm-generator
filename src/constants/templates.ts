/**
 * Template Definitions
 */

import type { Template, TemplateType } from "@/types";

/**
 * All available templates
 */
export const TEMPLATES: Record<TemplateType, Template> = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "Blue gradient background with white text",
    thumbnail: "/templates/classic.png",
    defaultConfig: {
      fontSize: "medium",
      textColor: "#FFFFFF",
      backgroundColor: "#3B82F6",
      backgroundGradient: {
        type: "linear",
        colors: ["#3B82F6", "#1E40AF"],
        angle: 135,
      },
      textPosition: "center",
    },
  },

  dark: {
    id: "dark",
    name: "Dark Mode",
    description: "Dark background with green accent",
    thumbnail: "/templates/dark.png",
    defaultConfig: {
      fontSize: "medium",
      textColor: "#10B981",
      backgroundColor: "#1F2937",
      textPosition: "center",
    },
  },

  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean white background with black text",
    thumbnail: "/templates/minimal.png",
    defaultConfig: {
      fontSize: "medium",
      textColor: "#111827",
      backgroundColor: "#FFFFFF",
      textPosition: "center",
    },
  },

  vibrant: {
    id: "vibrant",
    name: "Vibrant",
    description: "Rainbow gradient background with white text",
    thumbnail: "/templates/vibrant.png",
    defaultConfig: {
      fontSize: "medium",
      textColor: "#FFFFFF",
      backgroundColor: "#FF6B6B",
      backgroundGradient: {
        type: "linear",
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
        angle: 90,
      },
      textPosition: "center",
    },
  },

  retro: {
    id: "retro",
    name: "Retro",
    description: "Vintage purple background with yellow text",
    thumbnail: "/templates/retro.png",
    defaultConfig: {
      fontSize: "medium",
      textColor: "#FBBF24",
      backgroundColor: "#7C3AED",
      textPosition: "center",
    },
  },
};

/**
 * Get template by ID
 */
export function getTemplate(id: TemplateType): Template {
  return TEMPLATES[id];
}

/**
 * Get all template IDs
 */
export function getTemplateIds(): TemplateType[] {
  return Object.keys(TEMPLATES) as TemplateType[];
}

/**
 * Get all templates as array
 */
export function getAllTemplates(): Template[] {
  return Object.values(TEMPLATES);
}
