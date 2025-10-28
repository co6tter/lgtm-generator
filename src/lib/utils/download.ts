/**
 * Download Utilities
 * Handles image download functionality
 */

import type { DownloadResult } from "@/types";

/**
 * Download image blob as file
 * Triggers browser download with proper filename
 *
 * @param blob - Image blob to download
 * @param filename - Optional custom filename (auto-generated if not provided)
 * @returns Download result with filename
 */
export async function downloadImage(blob: Blob, filename?: string): Promise<DownloadResult> {
  try {
    // Generate filename with timestamp if not provided
    const defaultFilename = `lgtm_${Date.now()}.png`;
    const name = filename || defaultFilename;

    // Create object URL
    const url = URL.createObjectURL(blob);

    // Create temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.style.display = "none";

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);

    return {
      success: true,
      filename: name,
    };
  } catch (error) {
    console.error("Download failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Download failed",
    };
  }
}

/**
 * Generate filename with timestamp
 * Format: lgtm_YYYYMMDD_HHMMSS.png
 */
export function generateFilename(text?: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;

  // Sanitize text for filename if provided
  if (text) {
    const sanitized = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 20);

    return sanitized ? `lgtm_${sanitized}_${timestamp}.png` : `lgtm_${timestamp}.png`;
  }

  return `lgtm_${timestamp}.png`;
}

/**
 * Check if download is supported
 */
export function isDownloadSupported(): boolean {
  return typeof document !== "undefined" && "download" in document.createElement("a");
}
