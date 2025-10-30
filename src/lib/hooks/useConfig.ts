/**
 * useConfig Hook
 * Provides convenient methods for managing LGTM configuration
 */

import { useEffect, useCallback } from "react";
import { useEditorStore } from "@/store";
import type { TemplateType, FontSize, TextPosition } from "@/types";
import { TEMPLATES } from "@/constants";
import { decodeConfigFromURL } from "@/lib/utils";

/**
 * Custom hook for managing LGTM configuration
 * Wraps EditorStore with convenient setter methods
 *
 * @returns Config state and setter functions
 */
export function useConfig() {
  const config = useEditorStore((state) => state.config);
  const updateConfig = useEditorStore((state) => state.updateConfig);
  const setConfig = useEditorStore((state) => state.setConfig);
  const resetConfig = useEditorStore((state) => state.resetConfig);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const canUndo = useEditorStore((state) => state.canUndo);
  const canRedo = useEditorStore((state) => state.canRedo);

  // Load config from URL on mount
  useEffect(() => {
    const urlConfig = decodeConfigFromURL();
    if (urlConfig) {
      setConfig(urlConfig);
    }
  }, [setConfig]);

  // Setter methods
  const setText = useCallback(
    (text: string) => {
      updateConfig({ text });
    },
    [updateConfig]
  );

  const setTemplate = useCallback(
    (template: TemplateType) => {
      const templateConfig = TEMPLATES[template].defaultConfig;
      updateConfig({
        template,
        fontSize: templateConfig.fontSize,
        textColor: templateConfig.textColor,
        backgroundColor: templateConfig.backgroundColor,
        textPosition: templateConfig.textPosition,
      });
    },
    [updateConfig]
  );

  const setTextColor = useCallback(
    (textColor: string) => {
      updateConfig({ textColor });
    },
    [updateConfig]
  );

  const setBackgroundColor = useCallback(
    (backgroundColor: string) => {
      updateConfig({ backgroundColor });
    },
    [updateConfig]
  );

  const setFontSize = useCallback(
    (fontSize: FontSize) => {
      updateConfig({ fontSize });
    },
    [updateConfig]
  );

  const setPosition = useCallback(
    (textPosition: TextPosition) => {
      updateConfig({ textPosition });
    },
    [updateConfig]
  );

  return {
    // Current config
    config,

    // Setters
    setText,
    setTemplate,
    setTextColor,
    setBackgroundColor,
    setFontSize,
    setPosition,

    // Full config operations
    setConfig,
    resetConfig,

    // History
    undo,
    redo,
    canUndo: canUndo(),
    canRedo: canRedo(),
  };
}
