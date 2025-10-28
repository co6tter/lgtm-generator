/**
 * Editor Store
 * Manages LGTM configuration state with undo/redo support
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LGTMConfig } from "@/types";
import { DEFAULT_CONFIG } from "@/constants";

interface EditorStore {
  // State
  config: LGTMConfig;
  history: LGTMConfig[];
  historyIndex: number;
  isGenerating: boolean;

  // Actions
  updateConfig: (updates: Partial<LGTMConfig>) => void;
  setConfig: (config: LGTMConfig) => void;
  resetConfig: () => void;
  undo: () => void;
  redo: () => void;
  setGenerating: (isGenerating: boolean) => void;

  // Computed
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      config: DEFAULT_CONFIG,
      history: [DEFAULT_CONFIG],
      historyIndex: 0,
      isGenerating: false,

      // Update config (creates new history entry)
      updateConfig: (updates) =>
        set((state) => {
          const newConfig = { ...state.config, ...updates };

          // Add to history (removing any forward history)
          const newHistory = [...state.history.slice(0, state.historyIndex + 1), newConfig];

          return {
            config: newConfig,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),

      // Set complete config (replaces current)
      setConfig: (config) =>
        set((state) => {
          const newHistory = [...state.history.slice(0, state.historyIndex + 1), config];

          return {
            config,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),

      // Reset to default config
      resetConfig: () =>
        set({
          config: DEFAULT_CONFIG,
          history: [DEFAULT_CONFIG],
          historyIndex: 0,
        }),

      // Undo to previous state
      undo: () =>
        set((state) => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            return {
              config: state.history[newIndex],
              historyIndex: newIndex,
            };
          }
          return state;
        }),

      // Redo to next state
      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            return {
              config: state.history[newIndex],
              historyIndex: newIndex,
            };
          }
          return state;
        }),

      // Set generating state
      setGenerating: (isGenerating) => set({ isGenerating }),

      // Check if undo is available
      canUndo: () => get().historyIndex > 0,

      // Check if redo is available
      canRedo: () => get().historyIndex < get().history.length - 1,
    }),
    {
      name: "lgtm-editor-storage",
      // Only persist the current config, not the full history
      partialize: (state) => ({ config: state.config }),
    }
  )
);
