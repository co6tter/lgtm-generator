"use client";

import { useState } from "react";
import { Link } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useCopyLink } from "@/lib/hooks/useCopyLink";
import type { LGTMConfig } from "@/types";

export interface CopyLinkButtonProps {
  config: LGTMConfig;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
}

export function CopyLinkButton({
  config,
  variant = "outline",
  size = "md",
  fullWidth = false,
  disabled = false,
}: CopyLinkButtonProps) {
  const [isCopying, setIsCopying] = useState(false);
  const handleCopyLink = useCopyLink();

  const onClick = async () => {
    setIsCopying(true);
    await handleCopyLink(config);
    setIsCopying(false);
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isCopying}
      isLoading={isCopying}
      onClick={onClick}
      aria-label="Copy shareable link"
    >
      {!isCopying && <Link className="mr-2 h-4 w-4" aria-hidden="true" />}
      Copy Link
    </Button>
  );
}
