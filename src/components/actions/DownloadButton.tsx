"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useDownload } from "@/lib/hooks/useDownload";
import type { LGTMConfig } from "@/types";

export interface DownloadButtonProps {
  imageData: { dataUrl: string; blob: Blob } | null;
  config: LGTMConfig;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
}

export function DownloadButton({
  imageData,
  config,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = useDownload();

  const onClick = async () => {
    if (imageData) {
      setIsDownloading(true);
      await handleDownload(imageData.blob, config.text);
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || !imageData || isDownloading}
      isLoading={isDownloading}
      onClick={onClick}
      aria-label="Download LGTM image"
    >
      {!isDownloading && <Download className="mr-2 h-4 w-4" aria-hidden="true" />}
      Download
    </Button>
  );
}
