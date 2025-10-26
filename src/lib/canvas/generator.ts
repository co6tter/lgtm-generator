/**
 * Canvas Image Generator
 * Main entry point for LGTM image generation using Canvas API
 */

import type { LGTMConfig, GenerateOptions, GenerateResult } from "@/types";
import { CANVAS_CONFIG } from "@/constants";
import { drawBackground } from "./background";
import { drawText } from "./text";

/**
 * Generate LGTM image using Canvas API
 *
 * @param config - LGTM configuration
 * @param options - Generation options (width, height, format, etc.)
 * @returns Promise with generation result (dataUrl and blob)
 */
export async function generateLGTMImage(
  config: LGTMConfig,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  try {
    const {
      width = CANVAS_CONFIG.WIDTH,
      height = CANVAS_CONFIG.HEIGHT,
      dpi = CANVAS_CONFIG.DPI,
      format = "png",
      quality = CANVAS_CONFIG.QUALITY,
    } = options;

    // Create canvas element
    const canvas = document.createElement("canvas");
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    // Get 2D context
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas 2D context");
    }

    // Scale for DPI (Retina display support)
    ctx.scale(dpi, dpi);

    // Draw background
    drawBackground(ctx, config, width, height);

    // Draw text
    drawText(ctx, config, width, height);

    // Convert to data URL
    const mimeType = `image/${format}`;
    const dataUrl = canvas.toDataURL(mimeType, quality);

    // Convert to Blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        },
        mimeType,
        quality
      );
    });

    return {
      success: true,
      dataUrl,
      blob,
    };
  } catch (error) {
    console.error("Image generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
