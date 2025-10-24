/**
 * Template Types
 * Defines the structure for LGTM templates
 */

import type { TemplateType, FontSize, TextPosition } from "./config";

/**
 * Gradient configuration
 */
export interface Gradient {
  type: "linear" | "radial";
  colors: string[]; // Array of hex colors
  angle?: number; // For linear gradients (degrees)
}

/**
 * Template default configuration
 */
export interface TemplateDefaultConfig {
  fontSize: FontSize;
  textColor: string;
  backgroundColor: string;
  backgroundGradient?: Gradient;
  textPosition: TextPosition;
  fontFamily?: string;
}

/**
 * Template definition
 */
export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  thumbnail: string; // URL or path
  defaultConfig: TemplateDefaultConfig;
}
