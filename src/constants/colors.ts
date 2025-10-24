/**
 * Color Presets and Palettes
 */

/**
 * Preset text colors
 */
export const PRESET_TEXT_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#FBBF24" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
] as const;

/**
 * Preset background colors
 */
export const PRESET_BG_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Dark Gray", value: "#1F2937" },
  { name: "White", value: "#FFFFFF" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Orange", value: "#F97316" },
  { name: "Red", value: "#EF4444" },
  { name: "Green", value: "#10B981" },
] as const;

/**
 * Design system color palette (from UI/UX spec)
 */
export const COLOR_PALETTE = {
  // Primary colors
  primary: "#3B82F6", // Blue-500
  secondary: "#6B7280", // Gray-500
  success: "#10B981", // Green-500
  error: "#EF4444", // Red-500

  // Neutral colors
  background: "#FFFFFF", // White
  surface: "#F9FAFB", // Gray-50
  border: "#E5E7EB", // Gray-200
  textPrimary: "#111827", // Gray-900
  textSecondary: "#6B7280", // Gray-500
} as const;
