/**
 * useDownload Hook
 * Provides download functionality with toast notifications
 */

import { useCallback } from "react";
import { downloadImage, generateFilename } from "@/lib/utils";
import { useToast } from "@/store";

/**
 * Custom hook for handling image downloads
 * Includes automatic toast notifications
 *
 * @returns Download function
 */
export function useDownload() {
  const toast = useToast();

  const handleDownload = useCallback(
    async (blob: Blob, text?: string) => {
      const filename = generateFilename(text);
      const result = await downloadImage(blob, filename);

      if (result.success) {
        toast.success(`Downloaded: ${result.filename}`);
      } else {
        toast.error(result.error || "Download failed");
      }

      return result;
    },
    [toast]
  );

  return handleDownload;
}
