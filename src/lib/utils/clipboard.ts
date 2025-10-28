/**
 * Clipboard Utilities
 * Handles copying images and text to clipboard
 */

import type { CopyResult } from "@/types";

/**
 * Copy image blob to clipboard
 * Uses Clipboard API when available
 *
 * @param blob - Image blob to copy
 * @returns Copy result
 */
export async function copyImageToClipboard(blob: Blob): Promise<CopyResult> {
  try {
    // Check if Clipboard API is supported
    if (!navigator.clipboard || !navigator.clipboard.write) {
      return {
        success: false,
        error: "Clipboard API not supported in this browser",
      };
    }

    // Create ClipboardItem with image
    const item = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([item]);

    return {
      success: true,
      message: "Image copied to clipboard",
    };
  } catch (error) {
    console.error("Failed to copy image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to copy image",
    };
  }
}

/**
 * Copy text to clipboard
 * Uses Clipboard API with fallback for older browsers
 *
 * @param text - Text to copy (e.g., URL)
 * @returns Copy result
 */
export async function copyTextToClipboard(text: string): Promise<CopyResult> {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return {
        success: true,
        message: "Copied to clipboard",
      };
    }

    // Fallback for older browsers
    return fallbackCopyText(text);
  } catch {
    // Try fallback if modern API fails
    return fallbackCopyText(text);
  }
}

/**
 * Fallback copy method using execCommand
 * For older browsers that don't support Clipboard API
 */
function fallbackCopyText(text: string): CopyResult {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-999999px";
    textarea.style.top = "-999999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (success) {
      return {
        success: true,
        message: "Copied to clipboard",
      };
    } else {
      return {
        success: false,
        error: "Copy command failed",
      };
    }
  } catch (error) {
    console.error("Fallback copy failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Copy failed",
    };
  }
}

/**
 * Copy link to clipboard (alias for copyTextToClipboard)
 */
export async function copyLinkToClipboard(url: string): Promise<CopyResult> {
  const result = await copyTextToClipboard(url);
  if (result.success) {
    return {
      ...result,
      message: "Link copied to clipboard",
    };
  }
  return result;
}

/**
 * Check if clipboard write is supported
 */
export function isClipboardSupported(): boolean {
  return typeof navigator !== "undefined" && "clipboard" in navigator;
}

/**
 * Check if image clipboard is supported
 */
export function isImageClipboardSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "clipboard" in navigator &&
    typeof ClipboardItem !== "undefined"
  );
}
