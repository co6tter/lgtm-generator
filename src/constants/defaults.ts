/**
 * Default Configuration and Constants
 */

import type { LGTMConfig, FontSize, TextPosition } from "@/types";

/**
 * Default LGTM configuration
 */
export const DEFAULT_CONFIG: LGTMConfig = {
  text: "LGTM",
  template: "classic",
  fontSize: "medium",
  textColor: "#FFFFFF",
  backgroundColor: "#3B82F6",
  textPosition: "center",
};

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  RECENT_CONFIGS: "lgtm_recent_configs",
  USER_PREFERENCES: "lgtm_user_preferences",
  LAST_CONFIG: "lgtm_last_config",
  VERSION: "lgtm_version",
} as const;

/**
 * Canvas configuration
 */
export const CANVAS_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  DPI: 2, // For retina displays
  FORMAT: "image/png",
  QUALITY: 0.95,
} as const;

/**
 * Font size mapping (in pixels)
 */
export const FONT_SIZE_MAP: Record<FontSize, number> = {
  small: 32,
  medium: 48,
  large: 64,
};

/**
 * Text position mapping (percentage from top)
 */
export const TEXT_POSITION_MAP: Record<TextPosition, number> = {
  top: 0.25, // 25% from top
  center: 0.5, // 50% from top
  bottom: 0.75, // 75% from top
};

/**
 * Validation constraints
 */
export const VALIDATION = {
  MAX_TEXT_LENGTH: 50,
  MAX_LINES: 3,
  MAX_RECENT_CONFIGS: 20,
  HEX_COLOR_REGEX: /^#[0-9A-F]{6}$/i,
} as const;

/**
 * Current schema version
 */
export const CURRENT_VERSION = 1;
