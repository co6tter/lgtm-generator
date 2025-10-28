/**
 * UI Store
 * Manages UI state (toasts, modals, etc.)
 */

import { create } from "zustand";
import type { Toast, ToastType } from "@/types";

interface UIStore {
  // Toast notifications
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modal state
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;

  // Loading state
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Toast state
  toasts: [],

  // Add toast notification
  addToast: (type, message, duration = 3000) =>
    set((state) => {
      const id = crypto.randomUUID();
      const newToast: Toast = {
        id,
        type,
        message,
        duration,
      };

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, duration);
      }

      return {
        toasts: [...state.toasts, newToast],
      };
    }),

  // Remove specific toast
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Clear all toasts
  clearToasts: () => set({ toasts: [] }),

  // Modal state
  isModalOpen: false,
  modalContent: null,

  // Open modal with content
  openModal: (content) =>
    set({
      isModalOpen: true,
      modalContent: content,
    }),

  // Close modal
  closeModal: () =>
    set({
      isModalOpen: false,
      modalContent: null,
    }),

  // Loading state
  isLoading: false,

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),
}));

// Convenience hooks for common toast types
export const useToast = () => {
  const addToast = useUIStore((state) => state.addToast);

  return {
    success: (message: string, duration?: number) => addToast("success", message, duration),
    error: (message: string, duration?: number) => addToast("error", message, duration),
    info: (message: string, duration?: number) => addToast("info", message, duration),
  };
};
