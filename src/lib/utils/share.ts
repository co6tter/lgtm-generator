/**
 * Share Utilities
 * Handles Web Share API for mobile sharing
 */

import type { ShareResult, LGTMConfig } from "@/types";

/**
 * Share image using Web Share API
 * Works on mobile devices that support the API
 *
 * @param blob - Image blob to share
 * @param config - LGTM configuration (for text/title)
 * @returns Share result
 */
export async function shareImage(blob: Blob, config: LGTMConfig): Promise<ShareResult> {
  try {
    // Check if Web Share API is supported
    if (!navigator.share) {
      return {
        success: false,
        error: "Web Share API not supported on this device",
      };
    }

    // Create File from Blob
    const file = new File([blob], "lgtm.png", { type: "image/png" });

    const shareData: ShareData = {
      title: "LGTM Image",
      text: config.text,
      files: [file],
    };

    // Check if sharing files is supported
    if (!navigator.canShare || !navigator.canShare(shareData)) {
      // Fallback: share without file (URL only)
      const urlData: ShareData = {
        title: "LGTM Generator",
        text: `Check out my LGTM image: "${config.text}"`,
        url: window.location.href,
      };

      await navigator.share(urlData);

      return {
        success: true,
        message: "Shared link (file sharing not supported)",
      };
    }

    // Share with file
    await navigator.share(shareData);

    return {
      success: true,
      message: "Image shared successfully",
    };
  } catch (error) {
    // User cancelled or error occurred
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: "Share cancelled",
      };
    }

    console.error("Share failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Share failed",
    };
  }
}

/**
 * Share URL only (fallback when file sharing not available)
 *
 * @param url - URL to share
 * @param title - Share title
 * @param text - Share text
 * @returns Share result
 */
export async function shareURL(url: string, title?: string, text?: string): Promise<ShareResult> {
  try {
    if (!navigator.share) {
      return {
        success: false,
        error: "Web Share API not supported",
      };
    }

    const shareData: ShareData = {
      title: title || "LGTM Generator",
      text: text || "Check out this LGTM image!",
      url,
    };

    await navigator.share(shareData);

    return {
      success: true,
      message: "Link shared successfully",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: "Share cancelled",
      };
    }

    console.error("Share failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Share failed",
    };
  }
}

/**
 * Check if Web Share API is supported
 */
export function isShareSupported(): boolean {
  return typeof navigator !== "undefined" && "share" in navigator;
}

/**
 * Check if file sharing is supported
 */
export function isFileShareSupported(): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare) {
    return false;
  }

  // Test with a dummy file
  try {
    const testFile = new File(["test"], "test.txt", { type: "text/plain" });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}
