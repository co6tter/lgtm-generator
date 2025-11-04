# Architecture Specification

## 1. System Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              React/Next.js Application              │    │
│  │                                                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │    │
│  │  │  Editor  │  │ Gallery  │  │  Components/UI  │  │    │
│  │  │   Page   │  │   Page   │  │                 │  │    │
│  │  └──────────┘  └──────────┘  └─────────────────┘  │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │         State Management (Zustand)           │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │       Canvas API / Image Generation          │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │          LocalStorage (Phase 1)              │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Next.js Server (Phase 2)              │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │          API Routes (Optional)               │  │    │
│  │  │  - /api/gallery                              │  │    │
│  │  │  - /api/images/[id]                          │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │            Vercel KV (Optional)              │  │    │
│  │  │         (Redis-compatible)                   │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Frontend:**
- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5+
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4+ (PostCSS)
- **State Management**: Zustand (to be added)
- **Image Generation**: Canvas API
- **Icons**: Heroicons or Lucide React (to be added)

**Backend (Phase 2):**
- **Runtime**: Next.js API Routes (Edge/Node.js)
- **Database**: Vercel KV (Redis-compatible)
- **Image Generation**: @vercel/og (to be added)

**Deployment:**
- **Platform**: Vercel
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain (optional)

**Development Tools:**
- **Package Manager**: pnpm
- **Linter**: ESLint 9
- **Formatter**: Prettier
- **Type Checking**: TypeScript
- **Testing**: Vitest 4 + React Testing Library 16

## 2. Frontend Architecture

### 2.1 Directory Structure

```
lgtm-generator/
├── src/                          # Source directory
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home/Editor page
│   │   ├── globals.css           # Global styles
│   │   ├── favicon.ico           # Favicon
│   │   ├── gallery/
│   │   │   └── page.tsx          # Gallery page
│   │   └── api/                  # API routes (Phase 2)
│   │       ├── gallery/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── images/
│   │           └── [id]/
│   │               └── route.ts
│   │
│   ├── components/               # React components
│   │   ├── editor/
│   │   │   ├── TextInput.tsx
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── FontSizeSelector.tsx
│   │   │   ├── PositionSelector.tsx
│   │   │   └── EditorPanel.tsx
│   │   ├── preview/
│   │   │   ├── PreviewCanvas.tsx
│   │   │   └── ActionButtons.tsx
│   │   ├── gallery/
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── GalleryItem.tsx
│   │   │   └── GalleryFilter.tsx
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Loading.tsx
│   │   └── layout/
│   │       └── Container.tsx
│   │
│   ├── lib/                      # Core library code
│   │   ├── canvas/
│   │   │   ├── generator.ts      # Main image generation
│   │   │   ├── background.ts     # Background drawing
│   │   │   └── text.ts           # Text rendering
│   │   ├── storage/
│   │   │   ├── localStorage.ts   # Browser storage
│   │   │   └── kv.ts             # Vercel KV (Phase 2)
│   │   ├── api/
│   │   │   ├── client.ts         # API client
│   │   │   └── types.ts          # API types
│   │   ├── utils/
│   │   │   ├── url.ts            # URL encoding/decoding
│   │   │   ├── validation.ts     # Input validation
│   │   │   ├── download.ts       # Download utilities
│   │   │   └── clipboard.ts      # Clipboard utilities
│   │   └── hooks/
│   │       ├── useCanvas.ts      # Canvas hook
│   │       ├── useConfig.ts      # Config management
│   │       └── useGallery.ts     # Gallery data
│   │
│   ├── store/                    # Zustand stores
│   │   ├── editorStore.ts
│   │   ├── galleryStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/                    # TypeScript types
│   │   ├── config.ts
│   │   ├── template.ts
│   │   ├── gallery.ts
│   │   └── api.ts
│   │
│   └── constants/                # Constants & config
│       ├── templates.ts          # Template definitions
│       ├── colors.ts             # Color presets
│       └── defaults.ts           # Default values
│
├── public/                       # Static assets
│   ├── templates/                # Template thumbnails (to be added)
│   ├── file.svg                  # Default Next.js assets
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── docs/                         # Documentation
│   ├── 01_requirements.md
│   ├── 02_uiux-design.md
│   ├── 03_data-design.md
│   ├── 04_api-design.md
│   ├── 05_architecture.md
│   └── README.md
│
├── tests/                        # Tests (optional, to be added)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/                      # GitHub config (to be added)
│   └── workflows/
│       └── deploy.yml
│
├── .history/                     # VSCode local history
├── node_modules/                 # Dependencies
├── .gitignore
├── eslint.config.mjs             # ESLint config (new flat config)
├── next.config.ts                # Next.js config
├── next-env.d.ts                 # Next.js TypeScript declarations
├── package.json
├── pnpm-lock.yaml                # pnpm lockfile
├── postcss.config.mjs            # PostCSS config (for Tailwind)
├── tsconfig.json                 # TypeScript config
└── README.md
```

**Note:**
- Next.js 15では`src/`ディレクトリが推奨パターン
- Path alias `@/*` は `./src/*` に設定済み（tsconfig.json）
- Tailwind CSS 4はPostCSS統合を使用

### 2.2 Component Architecture

#### 2.2.1 Component Hierarchy

```
App
├── Layout
│   ├── Header
│   └── Footer
│
├── EditorPage
│   ├── Container
│   │   ├── EditorPanel
│   │   │   ├── TextInput
│   │   │   ├── TemplateSelector
│   │   │   ├── ColorPicker (x2)
│   │   │   ├── FontSizeSelector
│   │   │   └── PositionSelector
│   │   │
│   │   └── PreviewSection
│   │       ├── PreviewCanvas
│   │       └── ActionButtons
│   │           ├── DownloadButton
│   │           ├── CopyLinkButton
│   │           └── ShareButton (mobile)
│   │
│   └── Toast
│
└── GalleryPage
    ├── Container
    │   ├── GalleryFilter
    │   └── GalleryGrid
    │       └── GalleryItem (x N)
    │
    └── Loading
```

#### 2.2.2 Component Communication

```
┌─────────────────────────────────────────────────────┐
│                   Zustand Store                      │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │ EditorStore │  │GalleryStore │  │  UIStore   │ │
│  └─────────────┘  └─────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────┘
         ▲                    ▲                 ▲
         │                    │                 │
    ┌────┴────┐          ┌────┴────┐      ┌────┴────┐
    │ Editor  │          │ Gallery │      │   UI    │
    │Components│         │Components│     │Components│
    └─────────┘          └─────────┘      └─────────┘
```

### 2.3 State Management

#### 2.3.1 EditorStore

```typescript
// src/store/editorStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LGTMConfig } from '@/types/config';
import { DEFAULT_CONFIG } from '@/constants/defaults';

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
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      history: [DEFAULT_CONFIG],
      historyIndex: 0,
      isGenerating: false,

      updateConfig: (updates) =>
        set((state) => {
          const newConfig = { ...state.config, ...updates };
          const newHistory = [
            ...state.history.slice(0, state.historyIndex + 1),
            newConfig,
          ];
          return {
            config: newConfig,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),

      setConfig: (config) =>
        set((state) => {
          const newHistory = [
            ...state.history.slice(0, state.historyIndex + 1),
            config,
          ];
          return {
            config,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),

      resetConfig: () =>
        set({
          config: DEFAULT_CONFIG,
          history: [DEFAULT_CONFIG],
          historyIndex: 0,
        }),

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

      setGenerating: (isGenerating) => set({ isGenerating }),
    }),
    {
      name: 'lgtm-editor-storage',
      partialize: (state) => ({ config: state.config }),
    }
  )
);
```

#### 2.3.2 UIStore

```typescript
// src/store/uiStore.ts
import { create } from 'zustand';
import type { Toast } from '@/types/ui';
interface UIStore {
  // Toast notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modal state
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  isModalOpen: false,
  modalContent: null,
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));
```

### 2.4 Custom Hooks

#### 2.4.1 useCanvas

```typescript
// src/lib/hooks/useCanvas.ts
import { useEffect, useRef, useState } from 'react';
import type { LGTMConfig } from '@/types/config';
import { generateLGTMImage } from '@/lib/canvas/generator';

export function useCanvas(config: LGTMConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<{
    dataUrl: string;
    blob: Blob;
  } | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      if (!canvasRef.current) return;

      const result = await generateLGTMImage(config, {
        canvas: canvasRef.current,
      });

      if (result.success && result.dataUrl && result.blob) {
        setImageData({
          dataUrl: result.dataUrl,
          blob: result.blob,
        });
      }
    };

    // Debounce generation
    const timer = setTimeout(generateImage, 300);
    return () => clearTimeout(timer);
  }, [config]);

  return {
    canvasRef,
    imageData,
  };
}
```

#### 2.4.2 useConfig

```typescript
// src/lib/hooks/useConfig.ts
import { useEffect, useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';
import type { LGTMConfig, TemplateType, FontSize, TextPosition } from '@/types/config';
import { TEMPLATES } from '@/constants/templates';
import { decodeConfigFromURL } from '@/lib/utils/url';

export function useConfig() {
  const { config, updateConfig, resetConfig } = useEditorStore();

  // Load config from URL on mount
  useEffect(() => {
    const urlConfig = decodeConfigFromURL();
    if (urlConfig) {
      updateConfig(urlConfig);
    }
  }, []);

  const setText = useCallback(
    (text: string) => updateConfig({ text }),
    [updateConfig]
  );

  const setTemplate = useCallback(
    (template: TemplateType) => {
      const templateConfig = TEMPLATES[template].defaultConfig;
      updateConfig({
        template,
        ...templateConfig,
      });
    },
    [updateConfig]
  );

  const setTextColor = useCallback(
    (textColor: string) => updateConfig({ textColor }),
    [updateConfig]
  );

  const setBackgroundColor = useCallback(
    (backgroundColor: string) => updateConfig({ backgroundColor }),
    [updateConfig]
  );

  const setFontSize = useCallback(
    (fontSize: FontSize) => updateConfig({ fontSize }),
    [updateConfig]
  );

  const setPosition = useCallback(
    (textPosition: TextPosition) => updateConfig({ textPosition }),
    [updateConfig]
  );

  return {
    config,
    setText,
    setTemplate,
    setTextColor,
    setBackgroundColor,
    setFontSize,
    setPosition,
    resetConfig,
  };
}
```

## 3. Backend Architecture (Phase 2)

### 3.1 API Layer

```
┌────────────────────────────────────────────┐
│         Next.js API Routes (Edge)          │
├────────────────────────────────────────────┤
│                                             │
│  /api/gallery                               │
│    ├── GET  - List gallery items           │
│    └── POST - Create gallery item          │
│                                             │
│  /api/gallery/[id]                          │
│    └── GET  - Get specific item            │
│                                             │
│  /api/images/[id]                           │
│    └── GET  - Generate image (server-side) │
│                                             │
│  /api/stats/[id]/download                   │
│    └── POST - Increment download count     │
│                                             │
└────────────────────────────────────────────┘
         │                          │
         │                          │
         ▼                          ▼
┌─────────────────┐       ┌─────────────────┐
│   Vercel KV     │       │   @vercel/og    │
│   (Redis)       │       │ (Image Gen)     │
└─────────────────┘       └─────────────────┘
```

### 3.2 Data Layer

**Vercel KV Schema:**

```
Key Pattern                  Type         Description
─────────────────────────────────────────────────────────
gallery:{id}                 Hash         Gallery item data
gallery:sorted:latest        Sorted Set   Items by creation time
gallery:sorted:popular       Sorted Set   Items by views
gallery:sorted:downloads     Sorted Set   Items by downloads
stats:{id}                   Hash         View/download counts
ratelimit:{ip}               String       Rate limit counter
```

### 3.3 Caching Strategy

```
┌──────────────┐
│    Client    │
└──────┬───────┘
       │
       │ 1. Request
       ▼
┌──────────────┐
│  Browser     │ Cache-Control: public, max-age=3600
│  Cache       │ (1 hour for static images)
└──────┬───────┘
       │ Cache miss
       │
       ▼
┌──────────────┐
│  Vercel Edge │ Cache: HIT/MISS
│  CDN         │ Edge caching for images & API
└──────┬───────┘
       │ Cache miss
       │
       ▼
┌──────────────┐
│  API Route   │ Server-side rendering
│  (Edge)      │ or KV lookup
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Vercel KV   │ In-memory Redis cache
│              │
└──────────────┘
```

**Cache Headers:**

```typescript
// For gallery API
{
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

// For generated images
{
  'Cache-Control': 'public, max-age=31536000, immutable',
}

// For stats (no cache)
{
  'Cache-Control': 'no-cache, no-store, must-revalidate',
}
```

## 4. Deployment Architecture

### 4.1 Vercel Deployment

```
┌─────────────────────────────────────────────────┐
│              Vercel Platform                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      Edge Network (Global CDN)           │  │
│  │  - Static assets                         │  │
│  │  - Cached API responses                  │  │
│  │  - Generated images                      │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      Serverless Functions                │  │
│  │  - Next.js SSR/SSG                       │  │
│  │  - API Routes                            │  │
│  │  - Edge Functions                        │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      Vercel KV (Phase 2)                 │  │
│  │  - Gallery data                          │  │
│  │  - Stats                                 │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

### 4.2 Build & Deploy Pipeline

```
┌─────────────┐
│   Git Push  │
│  (GitHub)   │
└──────┬──────┘
       │
       │ Webhook
       ▼
┌─────────────┐
│   Vercel    │
│   Build     │
├─────────────┤
│ 1. Install  │ pnpm install
│ 2. Lint     │ pnpm lint
│ 3. Type     │ tsc --noEmit
│ 4. Build    │ next build
└──────┬──────┘
       │
       │ Success
       ▼
┌─────────────┐
│   Deploy    │
├─────────────┤
│ - Static    │ → Edge CDN
│ - Functions │ → Serverless
│ - Env Vars  │ → Runtime
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Live!     │
│ (Production)│
└─────────────┘
```

### 4.3 Environment Configuration

**vercel.json:**

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1", "hnd1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        }
      ]
    },
    {
      "source": "/(.*).png",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Environment Variables:**

```bash
# .env.local (development)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# Vercel (production)
NEXT_PUBLIC_BASE_URL=https://lgtm-generator.vercel.app
KV_URL=https://xxx.upstash.io  # Auto-configured by Vercel
KV_REST_API_TOKEN=xxx          # Auto-configured by Vercel
NODE_ENV=production
```

## 5. Performance Optimization

### 5.1 Frontend Optimizations

**1. Code Splitting:**
```typescript
// Dynamic imports for heavy components
const GalleryPage = dynamic(() => import('./gallery/page'), {
  loading: () => <Loading />,
});
```

**2. Image Optimization:**
```typescript
// Use Next.js Image component for thumbnails
import Image from 'next/image';

<Image
  src="/templates/classic.png"
  width={120}
  height={90}
  alt="Classic template"
  loading="lazy"
/>
```

**3. Memoization:**
```typescript
// Memoize expensive computations
const PreviewCanvas = memo(({ config }: { config: LGTMConfig }) => {
  const { canvasRef, imageData } = useCanvas(config);
  return <canvas ref={canvasRef} />;
});
```

**4. Debouncing:**
```typescript
// Debounce text input
const debouncedSetText = useMemo(
  () => debounce((text: string) => setText(text), 300),
  [setText]
);
```

### 5.2 Backend Optimizations

**1. Edge Functions:**
```typescript
// Use Edge Runtime for faster response
export const runtime = 'edge';
```

**2. Incremental Static Regeneration:**
```typescript
// Revalidate gallery pages periodically
export const revalidate = 300; // 5 minutes
```

**3. Parallel Data Fetching:**
```typescript
// Fetch multiple items in parallel
const items = await Promise.all(
  ids.map(id => kv.get(`gallery:${id}`))
);
```

### 5.3 Bundle Size Optimization

**next.config.ts:**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
```

## 6. Security Architecture

### 6.1 Security Measures

**1. Input Validation:**
```typescript
// Sanitize all user inputs
const sanitizedText = sanitizeText(userInput);
const validatedConfig = validateLGTMConfig(config);
```

**2. CORS Configuration:**
```typescript
// Restrict API access
const allowedOrigins = [
  'https://lgtm-generator.vercel.app',
  process.env.NODE_ENV === 'development' && 'http://localhost:3000',
].filter(Boolean);
```

**3. Rate Limiting:**
```typescript
// Limit API requests
const rateLimitResult = await checkRateLimit(ip);
if (!rateLimitResult.allowed) {
  return new Response('Too many requests', { status: 429 });
}
```

**4. Content Security Policy:**
```typescript
// Set CSP headers
const headers = {
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval';",
};
```

### 6.2 Data Privacy

**1. No PII Collection:**
- No user accounts
- No tracking cookies
- No analytics (or privacy-friendly only)

**2. LocalStorage Encryption (Optional):**
```typescript
// Encrypt sensitive data in localStorage
const encryptedData = encrypt(JSON.stringify(config));
localStorage.setItem(key, encryptedData);
```

## 7. Monitoring & Logging

### 7.1 Error Tracking

```typescript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service (optional)
});

// React error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error:', error, errorInfo);
  }
}
```

### 7.2 Performance Monitoring

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric: Metric) {
  console.log(metric);
  // Send to analytics (optional)
}
```

### 7.3 Logging Strategy

```typescript
// Structured logging
const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: 'info', message, meta, timestamp: new Date() }));
  },
  error: (message: string, error?: Error, meta?: any) => {
    console.error(JSON.stringify({ level: 'error', message, error: error?.message, stack: error?.stack, meta, timestamp: new Date() }));
  },
};
```

## 8. Testing Strategy

### 8.1 Testing Pyramid

```
         ┌─────────────┐
         │  E2E Tests  │ (Few, critical paths)
         └─────────────┘
       ┌─────────────────┐
       │Integration Tests│ (API routes, components)
       └─────────────────┘
    ┌──────────────────────┐
    │     Unit Tests        │ (Utils, hooks, stores)
    └──────────────────────┘
```

### 8.2 Testing Tools

```json
{
  "devDependencies": {
    "vitest": "^4.0.7",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@vitejs/plugin-react": "^5.1.0",
    "jsdom": "^27.1.0"
  }
}
```

## 9. Scalability Considerations

### 9.1 Horizontal Scaling

Vercel handles this automatically:
- Edge functions scale on-demand
- Global CDN distribution
- Auto-scaling serverless functions

### 9.2 Vertical Scaling

Optimize for Vercel free tier:
- Minimize function execution time
- Maximize cache hit ratio
- Use static generation where possible

### 9.3 Database Scaling (Phase 2)

**Vercel KV Limits:**
- 256MB storage
- 3,000 commands/day

**Mitigation:**
- Aggressive caching
- Pagination
- Data compression
- Archive old items

## 10. Future Architecture Evolution

### 10.1 Phase 3+ Enhancements

**Potential additions:**
- User authentication (NextAuth.js)
- Image upload & custom backgrounds (Vercel Blob)
- Real-time collaboration (Vercel Edge Functions + WebSockets)
- Advanced analytics (Vercel Analytics)
- CDN image transformation (Vercel Image Optimization)

### 10.2 Migration Path

```
Phase 1 (Current)
  └─> Phase 2 (Add KV, Gallery)
       └─> Phase 3 (Add Auth, Upload)
            └─> Phase 4 (Add Collaboration)
```

## 11. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-21 | Initial | 初版作成 |
