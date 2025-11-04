"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { TextInput } from "@/components/editor/TextInput";
import { TemplateSelector } from "@/components/editor/TemplateSelector";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { FontSizeSelector } from "@/components/editor/FontSizeSelector";
import { PositionSelector } from "@/components/editor/PositionSelector";
import { CanvasPreview } from "@/components/editor/CanvasPreview";
import { DownloadButton } from "@/components/actions/DownloadButton";
import { CopyLinkButton } from "@/components/actions/CopyLinkButton";
import { ShareButton } from "@/components/actions/ShareButton";
import { UndoRedoButtons } from "@/components/actions/UndoRedoButtons";
import { useConfig } from "@/lib/hooks/useConfig";
import { PRESET_TEXT_COLORS, PRESET_BG_COLORS } from "@/constants/colors";

export function EditorPage() {
  const {
    config,
    setText,
    setTemplate,
    setFontSize,
    setTextColor,
    setBackgroundColor,
    setPosition,
  } = useConfig();

  const [imageData, setImageData] = useState<{ dataUrl: string; blob: Blob } | null>(null);

  const handleImageGenerated = (dataUrl: string, blob: Blob) => {
    setImageData({ dataUrl, blob });
  };

  return (
    <div className="bg-gray-50">
      <Container size="xl" className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">LGTM Generator</h1>
          <UndoRedoButtons />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Editor Panel */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit Your LGTM</h2>

              <div className="space-y-6">
                {/* Text Input */}
                <TextInput
                  label="Text"
                  value={config.text}
                  onChange={setText}
                  maxLength={50}
                  showCount
                  placeholder="Enter your text..."
                  helperText="Maximum 50 characters"
                />

                {/* Template Selector */}
                <TemplateSelector label="Template" value={config.template} onChange={setTemplate} />

                {/* Font Size Selector */}
                <FontSizeSelector
                  label="Font Size"
                  value={config.fontSize}
                  onChange={setFontSize}
                />

                {/* Text Position Selector */}
                <PositionSelector
                  label="Text Position"
                  value={config.textPosition}
                  onChange={setPosition}
                />

                {/* Text Color Picker */}
                <ColorPicker
                  label="Text Color"
                  value={config.textColor}
                  onChange={setTextColor}
                  presets={[...PRESET_TEXT_COLORS]}
                />

                {/* Background Color Picker */}
                <ColorPicker
                  label="Background Color"
                  value={config.backgroundColor}
                  onChange={setBackgroundColor}
                  presets={[...PRESET_BG_COLORS]}
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Preview</h2>
              <CanvasPreview
                config={config}
                onImageGenerated={handleImageGenerated}
                className="mb-4"
              />

              {/* Action Buttons */}
              <div className="space-y-3">
                <DownloadButton imageData={imageData} config={config} fullWidth />
                <div className="grid grid-cols-2 gap-3">
                  <CopyLinkButton config={config} fullWidth />
                  <ShareButton imageData={imageData} config={config} fullWidth />
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-blue-900">Tips</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Use Ctrl+Z / Ctrl+Y to undo/redo changes</li>
                <li>• Click &quot;Copy Link&quot; to share your configuration</li>
                <li>• All changes are saved automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
