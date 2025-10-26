/**
 * Canvas Text Drawing
 * Handles text rendering with multi-line support and positioning
 */

import type { LGTMConfig } from "@/types";
import { FONT_SIZE_MAP, TEXT_POSITION_MAP, VALIDATION } from "@/constants";

/**
 * Draw text on canvas
 * Supports multi-line text (max 3 lines) with configurable positioning
 *
 * @param ctx - Canvas 2D rendering context
 * @param config - LGTM configuration
 * @param width - Canvas width
 * @param height - Canvas height
 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  config: LGTMConfig,
  width: number,
  height: number
): void {
  const fontSize = FONT_SIZE_MAP[config.fontSize];
  const yPosition = height * TEXT_POSITION_MAP[config.textPosition];

  // Set text properties
  ctx.fillStyle = config.textColor;
  ctx.font = `bold ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Add text shadow for better readability
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Split text into lines (max 3 lines)
  const lines = config.text.split("\n").slice(0, VALIDATION.MAX_LINES);
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = yPosition - totalHeight / 2 + lineHeight / 2;

  // Draw each line
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.fillText(line, width / 2, y);
  });
}
