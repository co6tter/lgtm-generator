/**
 * useShare Hook
 * Provides share functionality with toast notifications
 */

import { useCallback } from "react";
import { shareImage, isShareSupported } from "@/lib/utils";
import { useToast } from "@/store";
import type { LGTMConfig } from "@/types";

/**
 * Custom hook for sharing images via Web Share API
 * Includes automatic toast notifications
 *
 * @returns Share function and availability check
 */
export function useShare() {
  const toast = useToast();

  const handleShare = useCallback(
    async (blob: Blob, config: LGTMConfig) => {
      if (!isShareSupported()) {
        toast.error("Sharing is not supported on this device");
        return { success: false, error: "Not supported" };
      }

      const result = await shareImage(blob, config);

      if (result.success) {
        toast.success("Shared successfully!");
      } else if (result.error !== "Share cancelled") {
        toast.error(result.error || "Share failed");
      }

      return result;
    },
    [toast]
  );

  return {
    share: handleShare,
    isSupported: isShareSupported(),
  };
}
