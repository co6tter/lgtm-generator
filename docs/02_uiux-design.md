# UI/UX Design Specification

## 1. Design Philosophy

### 1.1 Core Principles
1. **Simplicity First**: 最小限のクリックで目的を達成できる
2. **Instant Feedback**: すべての操作に即座にフィードバックを提供
3. **Mobile-Friendly**: モバイルファーストで設計
4. **Accessibility**: 誰でも使える、アクセシブルなデザイン

### 1.2 Design Goals
- 初めて訪れたユーザーが説明なしで使える
- 3クリック以内でLGTM画像を生成・ダウンロードできる
- 楽しく、気軽に使えるUI

## 2. User Journey

### 2.1 Primary User Flow

```
1. ランディング → 2. テキスト入力 → 3. カスタマイズ → 4. プレビュー → 5. ダウンロード/共有
```

#### Detailed Flow
```
[訪問]
  ↓
[メインページ表示]
- デフォルトで "LGTM" プレビューが表示されている
- すぐに編集可能な状態
  ↓
[テキスト編集] (Optional)
- テキストボックスに入力
- リアルタイムでプレビュー更新
  ↓
[スタイル選択] (Optional)
- テンプレート選択
- カラー変更
- サイズ調整
  ↓
[ダウンロード/共有]
- ダウンロードボタンクリック
- または共有リンクコピー
  ↓
[完了]
```

### 2.2 Secondary User Flow: ギャラリー閲覧

```
[ギャラリータブクリック]
  ↓
[画像一覧表示]
  ↓
[画像クリック]
  ↓
[詳細表示 + テンプレートとして使用]
  ↓
[エディタへ戻る]
```

## 3. Screen Layout

### 3.1 Overall Structure

```
┌─────────────────────────────────────────┐
│ Header                                   │
├─────────────────────────────────────────┤
│                                          │
│         Main Content Area                │
│                                          │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │             │  │                 │  │
│  │  Controls   │  │    Preview      │  │
│  │             │  │                 │  │
│  └─────────────┘  └─────────────────┘  │
│                                          │
├─────────────────────────────────────────┤
│ Footer                                   │
└─────────────────────────────────────────┘
```

### 3.2 Component Breakdown

#### 3.2.1 Header Component
```
┌──────────────────────────────────────────────┐
│ [Logo] LGTM Generator    [Editor] [Gallery]  │
└──────────────────────────────────────────────┘
```

**Elements:**
- Logo + Title (左揃え)
- Navigation Tabs (右揃え)
  - "Editor" (デフォルト選択)
  - "Gallery"
- Height: 64px (Desktop), 56px (Mobile)

#### 3.2.2 Editor Page (Main Content)

**Desktop Layout (≥768px):**
```
┌────────────────────────────────────────────────────────┐
│  Controls (Left: 40%)      Preview (Right: 60%)        │
│  ┌─────────────────────┐  ┌──────────────────────────┐│
│  │ Text Input          │  │                          ││
│  │ ┌─────────────────┐ │  │                          ││
│  │ │ LGTM            │ │  │      [Preview Image]     ││
│  │ └─────────────────┘ │  │                          ││
│  │                     │  │                          ││
│  │ Template Selection  │  │                          ││
│  │ [TPL1][TPL2][TPL3] │  │                          ││
│  │                     │  │                          ││
│  │ Customize           │  └──────────────────────────┘│
│  │ • Text Color: ⬤    │                               │
│  │ • BG Color: ⬤      │  ┌──────────────────────────┐│
│  │ • Font Size: [S M L]│  │ [Download] [Copy Link]  ││
│  │ • Position: [^ - v]│  └──────────────────────────┘│
│  └─────────────────────┘                              │
└────────────────────────────────────────────────────────┘
```

**Mobile Layout (<768px):**
```
┌─────────────────────────┐
│  Preview                │
│  ┌────────────────────┐ │
│  │                    │ │
│  │  [Preview Image]   │ │
│  │                    │ │
│  └────────────────────┘ │
│                         │
│  Controls               │
│  ┌────────────────────┐ │
│  │ Text Input         │ │
│  │ Template Selection │ │
│  │ Customize Options  │ │
│  └────────────────────┘ │
│                         │
│  [Download] [Share]     │
└─────────────────────────┘
```

#### 3.2.3 Gallery Page

```
┌──────────────────────────────────────────┐
│  [Filter: Latest ▼]     [Search: 🔍]     │
├──────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │IMG1│ │IMG2│ │IMG3│ │IMG4│           │
│  └────┘ └────┘ └────┘ └────┘           │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │IMG5│ │IMG6│ │IMG7│ │IMG8│           │
│  └────┘ └────┘ └────┘ └────┘           │
│                                          │
│        [Load More]                       │
└──────────────────────────────────────────┘
```

## 4. Component Specifications

### 4.1 Text Input Component

**Type:** Textarea
**Specifications:**
- Placeholder: "Enter your text (e.g., LGTM)"
- Default value: "LGTM"
- Max length: 50 characters
- Rows: 3
- Auto-resize: Yes
- Font: Monospace
- Character counter: "X/50" (右下表示)

**States:**
- Default: Border gray-300
- Focus: Border blue-500, shadow
- Error: Border red-500 (文字数超過時)

### 4.2 Template Selector

**Type:** Button Group / Card Grid
**Layout:** Horizontal scrollable (Mobile), Grid (Desktop)

**Each Template Card:**
```
┌──────────────┐
│ [Thumbnail]  │
│              │
│  "Classic"   │
└──────────────┘
```

**Specifications:**
- Size: 120x90px (Desktop), 100x75px (Mobile)
- Border: 2px solid
- Selected state: Border blue-500, shadow
- Hover: Scale 1.05, shadow

**Default Templates:**
1. **Classic**: White text on blue gradient
2. **Dark Mode**: Green text on dark background
3. **Minimal**: Black text on white
4. **Vibrant**: White text on rainbow gradient
5. **Retro**: Yellow text on purple background

### 4.3 Color Picker

**Type:** Color Input + Preset Swatches
**Layout:**
```
Color: ⬤ [#FFFFFF] [Color Input]

Presets: ⬤ ⬤ ⬤ ⬤ ⬤ ⬤
```

**Preset Colors:**
- Text: White, Black, Red, Blue, Green, Yellow
- Background: Blue, Dark Gray, White, Purple, Teal, Orange

### 4.4 Font Size Selector

**Type:** Segmented Control
**Options:** S | M | L
**Values:**
- S: 32px
- M: 48px (Default)
- L: 64px

### 4.5 Position Selector

**Type:** Segmented Control
**Options:** ↑ | - | ↓
**Labels:**
- ↑: Top
- -: Center (Default)
- ↓: Bottom

### 4.6 Preview Component

**Specifications:**
- Aspect Ratio: 4:3
- Max Width: 800px
- Background: Checkered pattern (to show transparency)
- Border: 1px solid gray-200
- Shadow: Medium

**Loading State:**
- Skeleton with pulse animation

### 4.7 Action Buttons

#### Download Button
- **Type:** Primary Button
- **Icon:** Download icon
- **Text:** "Download PNG"
- **Size:** Large
- **Color:** Blue-600
- **Behavior:** Triggers PNG download

#### Copy Link Button
- **Type:** Secondary Button
- **Icon:** Link icon
- **Text:** "Copy Link"
- **Size:** Large
- **Color:** Gray-600
- **Behavior:**
  - Copies URL to clipboard
  - Shows toast: "Link copied!"

#### Share Button (Mobile only)
- **Type:** Secondary Button
- **Icon:** Share icon
- **Text:** "Share"
- **Behavior:** Uses Web Share API

## 5. Visual Design

### 5.1 Color Palette

**Primary Colors:**
```
Primary:   #3B82F6 (Blue-500)
Secondary: #6B7280 (Gray-500)
Success:   #10B981 (Green-500)
Error:     #EF4444 (Red-500)
```

**Neutral Colors:**
```
Background:     #FFFFFF (White)
Surface:        #F9FAFB (Gray-50)
Border:         #E5E7EB (Gray-200)
Text Primary:   #111827 (Gray-900)
Text Secondary: #6B7280 (Gray-500)
```

### 5.2 Typography

**Font Family:**
- Primary: 'Inter', -apple-system, sans-serif
- Monospace: 'Monaco', 'Courier New', monospace

**Font Sizes:**
```
Heading 1: 32px / 2rem (Bold)
Heading 2: 24px / 1.5rem (Semibold)
Heading 3: 20px / 1.25rem (Semibold)
Body:      16px / 1rem (Regular)
Small:     14px / 0.875rem (Regular)
Tiny:      12px / 0.75rem (Regular)
```

**Line Heights:**
```
Tight:  1.25
Normal: 1.5
Loose:  1.75
```

### 5.3 Spacing

**Scale:** 4px base unit
```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
```

### 5.4 Border Radius

```
sm: 4px  (Buttons, inputs)
md: 8px  (Cards)
lg: 12px (Modals)
xl: 16px (Preview area)
```

### 5.5 Shadows

```
sm: 0 1px 2px rgba(0, 0, 0, 0.05)
md: 0 4px 6px rgba(0, 0, 0, 0.1)
lg: 0 10px 15px rgba(0, 0, 0, 0.1)
xl: 0 20px 25px rgba(0, 0, 0, 0.15)
```

## 6. Interactions & Animations

### 6.1 Micro-interactions

**Hover States:**
- Buttons: Background darkens 10%, scale 1.02
- Cards: Shadow increases, scale 1.05
- Links: Color darkens, underline appears

**Focus States:**
- Inputs: Blue outline, 2px, offset 2px
- Buttons: Blue outline, 2px

**Active States:**
- Buttons: Scale 0.98, brightness 90%

### 6.2 Transitions

**Default Timing:**
```css
transition: all 0.2s ease-in-out;
```

**Specific Animations:**
- Page transitions: 0.3s
- Modal open/close: 0.2s
- Toast notifications: 0.15s slide-in

### 6.3 Loading States

**Preview Update:**
- Debounce input: 300ms
- Fade transition: 150ms

**Download Action:**
- Button text changes to "Downloading..."
- Spinner icon appears
- Duration: Until download starts

### 6.4 Toast Notifications

**Position:** Top-right (Desktop), Top-center (Mobile)
**Duration:** 3 seconds
**Animation:** Slide-in from right

**Types:**
- Success: Green background, checkmark icon
- Error: Red background, X icon
- Info: Blue background, i icon

## 7. Responsive Design

### 7.1 Breakpoints

```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: ≥ 1024px
```

### 7.2 Responsive Behavior

**Mobile (<768px):**
- Single column layout
- Preview on top
- Controls below
- Full-width buttons
- Horizontal scroll for templates
- Hamburger menu (if needed)

**Tablet (768px-1024px):**
- Two column layout (40/60 split)
- Larger tap targets
- Optimized spacing

**Desktop (≥1024px):**
- Two column layout
- Hover states enabled
- Keyboard shortcuts available
- Maximum width container: 1280px

### 7.3 Touch Optimization (Mobile)

- Minimum tap target: 44x44px
- Increased padding around interactive elements
- Swipe gestures for gallery navigation
- Pull-to-refresh (optional)

## 8. Accessibility

### 8.1 WCAG 2.1 Compliance

**Level AA Requirements:**
- Color contrast ratio ≥ 4.5:1 (text)
- Color contrast ratio ≥ 3:1 (UI components)
- Focus indicators visible
- Keyboard navigation support
- Screen reader compatible

### 8.2 Keyboard Navigation

**Shortcuts:**
- `Tab`: Next element
- `Shift + Tab`: Previous element
- `Enter`: Activate button/download
- `Esc`: Close modal/dialog
- `Ctrl/Cmd + S`: Download (optional)

**Focus Order:**
1. Text input
2. Template selector
3. Color pickers
4. Size/position controls
5. Download button
6. Share button

### 8.3 Screen Reader Support

**ARIA Labels:**
- All buttons have aria-label
- Form inputs have associated labels
- Images have alt text
- Loading states announced

**Semantic HTML:**
- Proper heading hierarchy (h1, h2, h3)
- nav, main, footer elements
- button vs div for clickable elements

### 8.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 9. Error Handling & Feedback

### 9.1 Error States

**Text Input Errors:**
- Character limit exceeded
  - Message: "Text is too long (max 50 characters)"
  - Red border + error message below

**Download Errors:**
- Failed to generate image
  - Toast notification: "Failed to generate image. Please try again."
- Browser not supported
  - Alert: "Your browser doesn't support this feature. Please use a modern browser."

### 9.2 Empty States

**Gallery Empty:**
```
┌────────────────────────┐
│    [Icon]              │
│                        │
│  No images yet         │
│  Create your first     │
│  LGTM image!           │
│                        │
│  [Go to Editor]        │
└────────────────────────┘
```

**Search No Results:**
```
No results found for "query"
Try different keywords
```

### 9.3 Success Feedback

**Download Success:**
- Toast: "Image downloaded successfully!"
- Icon: Checkmark

**Link Copied:**
- Toast: "Link copied to clipboard!"
- Icon: Checkmark

## 10. Performance Considerations

### 10.1 Perceived Performance

- Skeleton screens for loading
- Optimistic UI updates
- Instant feedback on interactions
- Progressive image loading

### 10.2 Actual Performance

- Lazy load gallery images
- Debounce text input (300ms)
- Throttle scroll events (100ms)
- Code splitting by route

## 11. Design Deliverables

### 11.1 Required Assets

**Icons:**
- Download icon
- Link/share icon
- Color picker icon
- Size icons (S/M/L)
- Position icons
- Search icon
- Menu icon (mobile)

**Icon Source:** Heroicons or Lucide React

**Template Thumbnails:**
- 5 preset template preview images
- Size: 240x180px @2x
- Format: WebP with PNG fallback

### 11.2 Style Guide

To be documented in separate `style-guide.md` with:
- Color swatches
- Typography samples
- Component variations
- Spacing examples

## 12. Future Enhancements (Post-MVP)

### 12.1 Advanced Features
- Dark mode toggle
- Custom font upload
- Image background (instead of solid color)
- Animation effects
- Multiple image export (batch)

### 12.2 UX Improvements
- Undo/redo functionality
- Keyboard shortcuts panel
- Tutorial/onboarding flow
- User preferences persistence
- Template favorites

## 13. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-21 | Initial | 初版作成 |
