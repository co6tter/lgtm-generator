"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { LGTMConfig } from "@/types";
import { useCanvas } from "@/lib/hooks/useCanvas";

export interface CanvasPreviewProps {
  config: LGTMConfig;
  width?: number;
  height?: number;
  className?: string;
  onImageGenerated?: (dataUrl: string, blob: Blob) => void;
}

export function CanvasPreview({
  config,
  width = 800,
  height = 600,
  className = "",
  onImageGenerated,
}: CanvasPreviewProps) {
  const { canvasRef, imageData, isGenerating, error } = useCanvas(config);
  const prevImageDataRef = useRef<{ dataUrl: string; blob: Blob } | null>(null);

  useEffect(() => {
    if (imageData && imageData !== prevImageDataRef.current && onImageGenerated) {
      prevImageDataRef.current = imageData;
      onImageGenerated(imageData.dataUrl, imageData.blob);
    }
  }, [imageData, onImageGenerated]);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
        {isGenerating && (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
              <p className="text-sm text-gray-600">Generating preview...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600">Failed to generate preview</p>
              <p className="mt-1 text-xs text-red-500">{error}</p>
            </div>
          </div>
        )}

        {!isGenerating && !error && imageData && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageData.dataUrl}
            alt="LGTM preview"
            className="h-full w-full object-contain"
            width={width}
            height={height}
          />
        )}

        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {!error && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            {width} × {height}px {imageData && `• ${(imageData.blob.size / 1024).toFixed(1)} KB`}
          </p>
        </div>
      )}
    </div>
  );
}
