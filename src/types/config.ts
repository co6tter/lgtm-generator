/**
 * LGTM Configuration Types
 * Defines the structure for LGTM image generation settings
 */

/**
 * Template type enumeration
 */
export type TemplateType = "classic" | "dark" | "minimal" | "vibrant" | "retro";

/**
 * Font size options
 */
export type FontSize = "small" | "medium" | "large";

/**
 * Text position options
 */
export type TextPosition = "top" | "center" | "bottom";

/**
 * Main configuration interface for LGTM image generation
 */
export interface LGTMConfig {
  // Identifier (optional, for sharing)
  id?: string;

  // Text settings
  text: string; // Display text (max 50 chars)

  // Style settings
  template: TemplateType; // Template type
  fontSize: FontSize; // Font size
  textColor: string; // Text color (hex)
  backgroundColor: string; // Background color (hex)
  textPosition: TextPosition; // Text position

  // Metadata (optional)
  createdAt?: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
}
