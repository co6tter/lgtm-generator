"use client";

import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useEditorStore } from "@/store/editorStore";

export interface UndoRedoButtonsProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  showLabels?: boolean;
}

export function UndoRedoButtons({
  size = "sm",
  variant = "ghost",
  showLabels = false,
}: UndoRedoButtonsProps) {
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const canUndo = useEditorStore((state) => state.canUndo());
  const canRedo = useEditorStore((state) => state.canRedo());

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={variant}
        size={size}
        disabled={!canUndo}
        onClick={undo}
        aria-label="Undo"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className={showLabels ? "mr-2 h-4 w-4" : "h-4 w-4"} aria-hidden="true" />
        {showLabels && "Undo"}
      </Button>
      <Button
        variant={variant}
        size={size}
        disabled={!canRedo}
        onClick={redo}
        aria-label="Redo"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className={showLabels ? "mr-2 h-4 w-4" : "h-4 w-4"} aria-hidden="true" />
        {showLabels && "Redo"}
      </Button>
    </div>
  );
}
