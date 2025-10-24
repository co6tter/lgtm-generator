/**
 * UI Types
 * Defines types for UI components and interactions
 */

/**
 * Toast notification type
 */
export type ToastType = "success" | "error" | "info";

/**
 * Toast notification interface
 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // Duration in milliseconds (default: 3000)
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * API Response wrapper
 */
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Generate options for canvas
 */
export interface GenerateOptions {
  width?: number; // Default: 800
  height?: number; // Default: 600
  dpi?: number; // Default: 2
  format?: "png" | "jpeg" | "webp"; // Default: 'png'
  quality?: number; // 0-1, default: 0.95
}

/**
 * Generate result
 */
export interface GenerateResult {
  success: boolean;
  dataUrl?: string; // data:image/png;base64,...
  blob?: Blob;
  error?: string;
}

/**
 * Download result
 */
export interface DownloadResult {
  success: boolean;
  filename?: string;
  error?: string;
}

/**
 * Copy result
 */
export interface CopyResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Share result
 */
export interface ShareResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Storage result
 */
export interface StorageResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
