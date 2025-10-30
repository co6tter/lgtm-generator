/**
 * useCopyLink Hook
 * Provides link copying functionality with toast notifications
 */

import { useCallback } from "react";
import { copyLinkToClipboard, encodeConfigToURL } from "@/lib/utils";
import { useToast } from "@/store";
import type { LGTMConfig } from "@/types";

/**
 * Custom hook for copying shareable links
 * Includes automatic toast notifications
 *
 * @returns Copy link function
 */
export function useCopyLink() {
  const toast = useToast();

  const handleCopyLink = useCallback(
    async (config: LGTMConfig) => {
      const url = encodeConfigToURL(config);
      const result = await copyLinkToClipboard(url);

      if (result.success) {
        toast.success("Link copied to clipboard!");
      } else {
        toast.error(result.error || "Failed to copy link");
      }

      return result;
    },
    [toast]
  );

  return handleCopyLink;
}
