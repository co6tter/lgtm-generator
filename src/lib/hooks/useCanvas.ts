/**
 * useCanvas Hook
 * Manages Canvas image generation with debounced updates
 */

import { useEffect, useState, useRef } from "react";
import type { LGTMConfig } from "@/types";
import { generateLGTMImage } from "@/lib/canvas";

interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageData: {
    dataUrl: string;
    blob: Blob;
  } | null;
  isGenerating: boolean;
  error: string | null;
}

/**
 * Custom hook for Canvas-based image generation
 * Automatically regenerates image when config changes
 *
 * @param config - LGTM configuration
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 * @returns Canvas ref, image data, loading and error states
 */
export function useCanvas(config: LGTMConfig, debounceMs: number = 300): UseCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<{ dataUrl: string; blob: Blob } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const generateImage = async () => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await generateLGTMImage(config);

        if (!isMounted) return;

        if (result.success && result.dataUrl && result.blob) {
          setImageData({
            dataUrl: result.dataUrl,
            blob: result.blob,
          });
          setError(null);
        } else {
          setError(result.error || "Failed to generate image");
          setImageData(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setImageData(null);
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    };

    // Debounce generation to avoid excessive re-renders
    const timer = setTimeout(generateImage, debounceMs);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [config, debounceMs]);

  return {
    canvasRef,
    imageData,
    isGenerating,
    error,
  };
}
