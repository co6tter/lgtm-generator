/**
 * Validation and Sanitization Utilities
 * Ensures data integrity and security
 */

import type { LGTMConfig, ValidationResult, TemplateType, FontSize, TextPosition } from "@/types";
import { VALIDATION } from "@/constants";

/**
 * Valid template types
 */
const VALID_TEMPLATES: TemplateType[] = ["classic", "dark", "minimal", "vibrant", "retro"];

/**
 * Valid font sizes
 */
const VALID_FONT_SIZES: FontSize[] = ["small", "medium", "large"];

/**
 * Valid text positions
 */
const VALID_POSITIONS: TextPosition[] = ["top", "center", "bottom"];

/**
 * Validate LGTM configuration
 * Checks all fields for correctness
 */
export function validateLGTMConfig(config: Partial<LGTMConfig>): ValidationResult {
  const errors: string[] = [];

  // Validate text
  if (config.text !== undefined) {
    if (typeof config.text !== "string") {
      errors.push("Text must be a string");
    } else if (config.text.length === 0) {
      errors.push("Text cannot be empty");
    } else if (config.text.length > VALIDATION.MAX_TEXT_LENGTH) {
      errors.push(`Text must be ${VALIDATION.MAX_TEXT_LENGTH} characters or less`);
    }
  }

  // Validate template
  if (config.template !== undefined) {
    if (!VALID_TEMPLATES.includes(config.template)) {
      errors.push(`Invalid template: ${config.template}`);
    }
  }

  // Validate fontSize
  if (config.fontSize !== undefined) {
    if (!VALID_FONT_SIZES.includes(config.fontSize)) {
      errors.push(`Invalid font size: ${config.fontSize}`);
    }
  }

  // Validate textPosition
  if (config.textPosition !== undefined) {
    if (!VALID_POSITIONS.includes(config.textPosition)) {
      errors.push(`Invalid text position: ${config.textPosition}`);
    }
  }

  // Validate colors (hex format)
  if (config.textColor !== undefined) {
    if (!VALIDATION.HEX_COLOR_REGEX.test(config.textColor)) {
      errors.push(`Invalid text color format: ${config.textColor}`);
    }
  }

  if (config.backgroundColor !== undefined) {
    if (!VALIDATION.HEX_COLOR_REGEX.test(config.backgroundColor)) {
      errors.push(`Invalid background color format: ${config.backgroundColor}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize text input
 * Removes potentially harmful characters
 */
export function sanitizeText(text: string): string {
  return (
    text
      // Remove HTML tags
      .replace(/[<>]/g, "")
      // Trim whitespace
      .trim()
      // Enforce max length
      .slice(0, VALIDATION.MAX_TEXT_LENGTH)
  );
}

/**
 * Sanitize color value
 * Ensures valid hex color format
 */
export function sanitizeColor(color: string): string {
  // Remove non-hex characters
  const cleaned = color.replace(/[^0-9A-F#]/gi, "").toUpperCase();

  // Ensure # prefix
  const withHash = cleaned.startsWith("#") ? cleaned : `#${cleaned}`;

  // Validate length
  if (withHash.length === 7 && VALIDATION.HEX_COLOR_REGEX.test(withHash)) {
    return withHash;
  }

  // Return black as safe default
  return "#000000";
}

/**
 * Validate template type
 */
export function isValidTemplate(template: string): template is TemplateType {
  return VALID_TEMPLATES.includes(template as TemplateType);
}

/**
 * Validate font size
 */
export function isValidFontSize(size: string): size is FontSize {
  return VALID_FONT_SIZES.includes(size as FontSize);
}

/**
 * Validate text position
 */
export function isValidTextPosition(position: string): position is TextPosition {
  return VALID_POSITIONS.includes(position as TextPosition);
}

/**
 * Sanitize and validate entire config
 * Returns sanitized config with validation result
 */
export function sanitizeAndValidateConfig(config: Partial<LGTMConfig>): {
  config: Partial<LGTMConfig>;
  validation: ValidationResult;
} {
  const sanitized: Partial<LGTMConfig> = {
    ...config,
  };

  // Sanitize text
  if (sanitized.text) {
    sanitized.text = sanitizeText(sanitized.text);
  }

  // Sanitize colors
  if (sanitized.textColor) {
    sanitized.textColor = sanitizeColor(sanitized.textColor);
  }

  if (sanitized.backgroundColor) {
    sanitized.backgroundColor = sanitizeColor(sanitized.backgroundColor);
  }

  // Validate sanitized config
  const validation = validateLGTMConfig(sanitized);

  return {
    config: sanitized,
    validation,
  };
}
