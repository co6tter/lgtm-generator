/**
 * URL Encoding/Decoding Utilities
 * Handles configuration sharing via URL parameters
 */

import type { LGTMConfig, TemplateType, FontSize, TextPosition } from "@/types";
import { DEFAULT_CONFIG } from "@/constants";
import { validateLGTMConfig } from "./validation";

/**
 * Encode LGTM configuration to URL
 * Uses short parameter names to keep URLs manageable
 */
export function encodeConfigToURL(config: LGTMConfig, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");

  const params = new URLSearchParams();

  // Use short keys to minimize URL length
  params.set("text", config.text);
  params.set("tpl", config.template);
  params.set("size", config.fontSize);
  params.set("tc", config.textColor.replace("#", ""));
  params.set("bg", config.backgroundColor.replace("#", ""));
  params.set("pos", config.textPosition);

  return `${base}?${params.toString()}`;
}

/**
 * Decode LGTM configuration from URL
 * Returns null if no valid config found in URL
 */
export function decodeConfigFromURL(url?: string): LGTMConfig | null {
  try {
    const urlObj = url ? new URL(url) : new URL(window.location.href);
    const params = urlObj.searchParams;

    // Check if config params exist
    if (!params.has("text") && !params.has("tpl")) {
      return null; // No config in URL
    }

    const config: LGTMConfig = {
      text: params.get("text") || DEFAULT_CONFIG.text,
      template: (params.get("tpl") as TemplateType) || DEFAULT_CONFIG.template,
      fontSize: (params.get("size") as FontSize) || DEFAULT_CONFIG.fontSize,
      textColor: params.get("tc") ? `#${params.get("tc")}` : DEFAULT_CONFIG.textColor,
      backgroundColor: params.get("bg") ? `#${params.get("bg")}` : DEFAULT_CONFIG.backgroundColor,
      textPosition: (params.get("pos") as TextPosition) || DEFAULT_CONFIG.textPosition,
    };

    // Validate decoded config
    const validation = validateLGTMConfig(config);
    if (!validation.isValid) {
      console.error("Invalid config from URL:", validation.errors);
      return null;
    }

    return config;
  } catch (error) {
    console.error("Failed to decode config from URL:", error);
    return null;
  }
}

/**
 * Encode configuration to base64 (alternative compact format)
 */
export function encodeConfigToBase64(config: LGTMConfig): string {
  try {
    const json = JSON.stringify(config);
    return btoa(encodeURIComponent(json));
  } catch (error) {
    console.error("Failed to encode config to base64:", error);
    return "";
  }
}

/**
 * Decode configuration from base64
 */
export function decodeConfigFromBase64(encoded: string): LGTMConfig | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const config = JSON.parse(json) as LGTMConfig;

    const validation = validateLGTMConfig(config);
    if (!validation.isValid) {
      return null;
    }

    return config;
  } catch (error) {
    console.error("Failed to decode config from base64:", error);
    return null;
  }
}

/**
 * Get shareable URL for current configuration
 */
export function getShareableURL(config: LGTMConfig): string {
  return encodeConfigToURL(config);
}

/**
 * Copy URL to clipboard
 */
export async function copyURLToClipboard(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }

    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    console.error("Failed to copy URL:", error);
    return false;
  }
}
