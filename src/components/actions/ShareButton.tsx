"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useShare } from "@/lib/hooks/useShare";
import type { LGTMConfig } from "@/types";

export interface ShareButtonProps {
  imageData: { dataUrl: string; blob: Blob } | null;
  config: LGTMConfig;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
}

export function ShareButton({
  imageData,
  config,
  variant = "secondary",
  size = "md",
  fullWidth = false,
  disabled = false,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { share: handleShare, isSupported } = useShare();

  const onClick = async () => {
    if (imageData) {
      setIsSharing(true);
      await handleShare(imageData.blob, config);
      setIsSharing(false);
    }
  };

  // Don't render if Web Share API is not supported
  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || !imageData || isSharing}
      isLoading={isSharing}
      onClick={onClick}
      aria-label="Share LGTM image"
    >
      {!isSharing && <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />}
      Share
    </Button>
  );
}
