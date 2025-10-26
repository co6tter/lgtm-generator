/**
 * Canvas Background Drawing
 * Handles background rendering including solid colors and gradients
 */

import type { LGTMConfig } from "@/types";
import { TEMPLATES } from "@/constants";

/**
 * Draw background on canvas
 * Supports solid colors and gradients (linear and radial)
 *
 * @param ctx - Canvas 2D rendering context
 * @param config - LGTM configuration
 * @param width - Canvas width
 * @param height - Canvas height
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  config: LGTMConfig,
  width: number,
  height: number
): void {
  const template = TEMPLATES[config.template];
  const gradient = template.defaultConfig.backgroundGradient;

  if (gradient) {
    // Draw gradient background
    let grad: CanvasGradient;

    if (gradient.type === "linear") {
      // Calculate gradient direction based on angle
      const angle = (gradient.angle || 0) * (Math.PI / 180);
      const x1 = width / 2 - (Math.cos(angle) * width) / 2;
      const y1 = height / 2 - (Math.sin(angle) * height) / 2;
      const x2 = width / 2 + (Math.cos(angle) * width) / 2;
      const y2 = height / 2 + (Math.sin(angle) * height) / 2;

      grad = ctx.createLinearGradient(x1, y1, x2, y2);
    } else {
      // Radial gradient
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.max(width, height) / 2;

      grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    }

    // Add color stops
    gradient.colors.forEach((color, index) => {
      const stop = index / (gradient.colors.length - 1);
      grad.addColorStop(stop, color);
    });

    ctx.fillStyle = grad;
  } else {
    // Draw solid color background
    ctx.fillStyle = config.backgroundColor;
  }

  // Fill the entire canvas
  ctx.fillRect(0, 0, width, height);
}
