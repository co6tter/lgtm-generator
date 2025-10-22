# API Design Specification

## 1. Overview

### 1.1 API Strategy

**Phase 1 (MVP - Client-side only):**
- No backend API required
- クライアントサイドのCanvas APIで画像生成
- すべての処理をブラウザで完結

**Phase 2 (Optional - Server-side enhancement):**
- Next.js API Routes for optional features
- Vercel KV integration for gallery
- Server-side image generation (fallback)

### 1.2 API Principles

1. **RESTful design** (when applicable)
2. **Type-safe** (TypeScript throughout)
3. **Minimal overhead** (lightweight payloads)
4. **Graceful degradation** (fallback for unsupported features)
5. **Stateless** (no session management)

## 2. Client-side APIs (Phase 1)

### 2.1 Image Generation API (Canvas-based)

#### 2.1.1 generateLGTMImage()

**Purpose:** Canvas APIを使ってLGTM画像を生成

**Function Signature:**

```typescript
async function generateLGTMImage(
  config: LGTMConfig,
  options?: GenerateOptions
): Promise<GenerateResult>

interface GenerateOptions {
  width?: number;       // Default: 800
  height?: number;      // Default: 600
  dpi?: number;         // Default: 2
  format?: 'png' | 'jpeg' | 'webp'; // Default: 'png'
  quality?: number;     // 0-1, default: 0.95
}

interface GenerateResult {
  success: boolean;
  dataUrl?: string;     // data:image/png;base64,...
  blob?: Blob;
  error?: string;
}
```

**Implementation:**

```typescript
async function generateLGTMImage(
  config: LGTMConfig,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  try {
    const {
      width = 800,
      height = 600,
      dpi = 2,
      format = 'png',
      quality = 0.95,
    } = options;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Scale for DPI
    ctx.scale(dpi, dpi);

    // Draw background
    drawBackground(ctx, config, width, height);

    // Draw text
    drawText(ctx, config, width, height);

    // Convert to data URL and blob
    const mimeType = `image/${format}`;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
        mimeType,
        quality
      );
    });

    return {
      success: true,
      dataUrl,
      blob,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

#### 2.1.2 drawBackground()

```typescript
function drawBackground(
  ctx: CanvasRenderingContext2D,
  config: LGTMConfig,
  width: number,
  height: number
): void {
  const template = TEMPLATES[config.template];
  const gradient = template.defaultConfig.backgroundGradient;

  if (gradient) {
    let grad: CanvasGradient;

    if (gradient.type === 'linear') {
      const angle = (gradient.angle || 0) * Math.PI / 180;
      const x1 = width / 2 - Math.cos(angle) * width / 2;
      const y1 = height / 2 - Math.sin(angle) * height / 2;
      const x2 = width / 2 + Math.cos(angle) * width / 2;
      const y2 = height / 2 + Math.sin(angle) * height / 2;

      grad = ctx.createLinearGradient(x1, y1, x2, y2);
    } else {
      grad = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
    }

    gradient.colors.forEach((color, index) => {
      grad.addColorStop(index / (gradient.colors.length - 1), color);
    });

    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = config.backgroundColor;
  }

  ctx.fillRect(0, 0, width, height);
}
```

#### 2.1.3 drawText()

```typescript
function drawText(
  ctx: CanvasRenderingContext2D,
  config: LGTMConfig,
  width: number,
  height: number
): void {
  const fontSize = FONT_SIZE_MAP[config.fontSize];
  const yPosition = height * TEXT_POSITION_MAP[config.textPosition];

  // Set text properties
  ctx.fillStyle = config.textColor;
  ctx.font = `bold ${fontSize}px "Inter", -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add text shadow for better readability
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Split text into lines (max 3)
  const lines = config.text.split('\n').slice(0, 3);
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = yPosition - (totalHeight / 2) + (lineHeight / 2);

  // Draw each line
  lines.forEach((line, index) => {
    const y = startY + (index * lineHeight);
    ctx.fillText(line, width / 2, y);
  });
}
```

### 2.2 Download API

#### 2.2.1 downloadImage()

```typescript
async function downloadImage(
  blob: Blob,
  filename?: string
): Promise<DownloadResult> {
  try {
    const defaultFilename = `lgtm_${new Date().getTime()}.png`;
    const name = filename || defaultFilename;

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);

    return {
      success: true,
      filename: name,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Download failed',
    };
  }
}

interface DownloadResult {
  success: boolean;
  filename?: string;
  error?: string;
}
```

### 2.3 Clipboard API

#### 2.3.1 copyImageToClipboard()

```typescript
async function copyImageToClipboard(blob: Blob): Promise<CopyResult> {
  try {
    // Check if Clipboard API is supported
    if (!navigator.clipboard || !navigator.clipboard.write) {
      throw new Error('Clipboard API not supported');
    }

    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);

    return {
      success: true,
      message: 'Image copied to clipboard',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Copy failed',
    };
  }
}

interface CopyResult {
  success: boolean;
  message?: string;
  error?: string;
}
```

#### 2.3.2 copyLinkToClipboard()

```typescript
async function copyLinkToClipboard(url: string): Promise<CopyResult> {
  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      // Fallback for older browsers
      return fallbackCopyText(url);
    }

    await navigator.clipboard.writeText(url);

    return {
      success: true,
      message: 'Link copied to clipboard',
    };
  } catch (error) {
    return fallbackCopyText(url);
  }
}

function fallbackCopyText(text: string): CopyResult {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    return success
      ? { success: true, message: 'Link copied' }
      : { success: false, error: 'Copy failed' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Copy failed',
    };
  }
}
```

### 2.4 Share API (Mobile)

#### 2.4.1 shareImage()

```typescript
async function shareImage(
  blob: Blob,
  config: LGTMConfig
): Promise<ShareResult> {
  try {
    // Check if Web Share API is supported
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }

    const file = new File([blob], 'lgtm.png', { type: 'image/png' });
    const shareData: ShareData = {
      title: 'LGTM Image',
      text: config.text,
      files: [file],
    };

    // Check if sharing files is supported
    if (!navigator.canShare || !navigator.canShare(shareData)) {
      throw new Error('Cannot share files on this device');
    }

    await navigator.share(shareData);

    return {
      success: true,
      message: 'Image shared successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Share failed',
    };
  }
}

interface ShareResult {
  success: boolean;
  message?: string;
  error?: string;
}
```

### 2.5 Storage API (LocalStorage)

#### 2.5.1 saveConfig()

```typescript
function saveConfig(config: LGTMConfig): StorageResult {
  try {
    const recent = getRecentConfigs();
    const newConfig = {
      ...config,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to beginning, limit to 20
    recent.unshift(newConfig);
    const limited = recent.slice(0, 20);

    localStorage.setItem(
      STORAGE_KEYS.RECENT_CONFIGS,
      JSON.stringify(limited)
    );

    return {
      success: true,
      data: newConfig,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Save failed',
    };
  }
}

interface StorageResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
```

#### 2.5.2 getRecentConfigs()

```typescript
function getRecentConfigs(): LGTMConfig[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_CONFIGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load recent configs:', error);
    return [];
  }
}
```

#### 2.5.3 clearRecentConfigs()

```typescript
function clearRecentConfigs(): StorageResult {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT_CONFIGS);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Clear failed',
    };
  }
}
```

### 2.6 URL API

#### 2.6.1 encodeConfigToURL()

```typescript
function encodeConfigToURL(config: LGTMConfig): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://lgtm-generator.vercel.app';

  const params = new URLSearchParams();

  // Use short keys to keep URL manageable
  params.set('text', config.text);
  params.set('tpl', config.template);
  params.set('size', config.fontSize);
  params.set('tc', config.textColor.replace('#', ''));
  params.set('bg', config.backgroundColor.replace('#', ''));
  params.set('pos', config.textPosition);

  return `${baseUrl}?${params.toString()}`;
}
```

#### 2.6.2 decodeConfigFromURL()

```typescript
function decodeConfigFromURL(url?: string): LGTMConfig | null {
  try {
    const urlObj = new URL(url || window.location.href);
    const params = urlObj.searchParams;

    if (!params.has('text')) {
      return null; // No config in URL
    }

    const config: LGTMConfig = {
      text: params.get('text') || DEFAULT_CONFIG.text,
      template: (params.get('tpl') as TemplateType) || DEFAULT_CONFIG.template,
      fontSize: (params.get('size') as FontSize) || DEFAULT_CONFIG.fontSize,
      textColor: `#${params.get('tc') || DEFAULT_CONFIG.textColor.replace('#', '')}`,
      backgroundColor: `#${params.get('bg') || DEFAULT_CONFIG.backgroundColor.replace('#', '')}`,
      textPosition: (params.get('pos') as TextPosition) || DEFAULT_CONFIG.textPosition,
    };

    // Validate decoded config
    const validation = validateLGTMConfig(config);
    if (!validation.isValid) {
      console.error('Invalid config from URL:', validation.errors);
      return null;
    }

    return config;
  } catch (error) {
    console.error('Failed to decode config from URL:', error);
    return null;
  }
}
```

## 3. Server-side APIs (Phase 2 - Optional)

### 3.1 Gallery API Routes

#### 3.1.1 GET /api/gallery

**Purpose:** ギャラリーアイテムの一覧取得

**Request:**

```typescript
GET /api/gallery?page=1&limit=20&sort=latest

interface GalleryQuery {
  page?: number;      // Default: 1
  limit?: number;     // Default: 20, Max: 50
  sort?: 'latest' | 'popular' | 'downloads'; // Default: 'latest'
  search?: string;    // Optional search query
}
```

**Response:**

```typescript
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "config": { /* LGTMConfig */ },
        "metadata": {
          "downloads": 42,
          "views": 156,
          "isPublic": true
        },
        "createdAt": "2025-10-21T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "hasMore": true
    }
  }
}

interface GalleryResponse {
  success: boolean;
  data?: {
    items: GalleryItem[];
    pagination: PaginationInfo;
  };
  error?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
```

**Implementation (Next.js API Route):**

```typescript
// src/app/api/gallery/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { GalleryItem } from '@/types/gallery';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const sort = searchParams.get('sort') || 'latest';

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Get sorted IDs from KV
    const sortKey = `gallery:sorted:${sort}`;
    const ids = await kv.zrange(sortKey, start, end, { rev: true });

    // Get items
    const items = await Promise.all(
      ids.map(id => kv.get<GalleryItem>(`gallery:${id}`))
    );

    // Get total count
    const total = await kv.zcard(sortKey);

    return NextResponse.json({
      success: true,
      data: {
        items: items.filter(Boolean),
        pagination: {
          page,
          limit,
          total,
          hasMore: end < total - 1,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery items',
      },
      { status: 500 }
    );
  }
}
```

#### 3.1.2 POST /api/gallery

**Purpose:** 新しいギャラリーアイテムを作成

**Request:**

```typescript
POST /api/gallery

{
  "config": {
    "text": "LGTM",
    "template": "classic",
    // ... other config fields
  },
  "metadata": {
    "isPublic": true
  }
}

interface CreateGalleryRequest {
  config: LGTMConfig;
  metadata?: {
    isPublic?: boolean;
    tags?: string[];
  };
}
```

**Response:**

```typescript
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "/api/gallery/uuid",
    "shareUrl": "https://lgtm-generator.vercel.app/gallery/uuid"
  }
}

interface CreateGalleryResponse {
  success: boolean;
  data?: {
    id: string;
    url: string;
    shareUrl: string;
  };
  error?: string;
}
```

**Implementation:**

```typescript
// src/app/api/gallery/route.ts
import { validateLGTMConfig } from '@/lib/utils/validation';
import type { CreateGalleryRequest } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body: CreateGalleryRequest = await request.json();

    // Validate config
    const validation = validateLGTMConfig(body.config);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid config: ${validation.errors.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Create gallery item
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const item: GalleryItem = {
      id,
      config: body.config,
      imageUrl: `/api/images/${id}`,
      metadata: {
        downloads: 0,
        views: 0,
        isPublic: body.metadata?.isPublic ?? true,
        tags: body.metadata?.tags,
      },
      createdAt: now,
      updatedAt: now,
    };

    // Save to KV
    await kv.set(`gallery:${id}`, item);

    // Add to sorted sets
    const timestamp = Date.now();
    await kv.zadd('gallery:sorted:latest', { score: timestamp, member: id });
    await kv.zadd('gallery:sorted:popular', { score: 0, member: id });
    await kv.zadd('gallery:sorted:downloads', { score: 0, member: id });

    const baseUrl = request.nextUrl.origin;
    return NextResponse.json({
      success: true,
      data: {
        id,
        url: `/api/gallery/${id}`,
        shareUrl: `${baseUrl}/gallery/${id}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create gallery item',
      },
      { status: 500 }
    );
  }
}
```

#### 3.1.3 GET /api/gallery/[id]

**Purpose:** 特定のギャラリーアイテムを取得

**Request:**

```typescript
GET /api/gallery/[id]
```

**Response:**

```typescript
{
  "success": true,
  "data": {
    "id": "uuid",
    "config": { /* LGTMConfig */ },
    "metadata": {
      "downloads": 42,
      "views": 157,
      "isPublic": true
    },
    "createdAt": "2025-10-21T10:00:00.000Z"
  }
}
```

**Implementation:**

```typescript
// src/app/api/gallery/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { GalleryItem } from '@/types/gallery';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await kv.get<GalleryItem>(`gallery:${params.id}`);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gallery item not found',
        },
        { status: 404 }
      );
    }

    // Increment view count
    await kv.hincrby(`stats:${params.id}`, 'views', 1);

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery item',
      },
      { status: 500 }
    );
  }
}
```

### 3.2 Image Generation API (Server-side fallback)

#### 3.2.1 GET /api/images/[id]

**Purpose:** サーバーサイドで画像を生成して返す（OGP用など）

**Request:**

```typescript
GET /api/images/[id]
```

**Response:**
- Content-Type: image/png
- Binary image data

**Implementation (using @vercel/og or canvas):**

```typescript
// src/app/api/images/[id]/route.ts
import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { kv } from '@vercel/kv';
import type { GalleryItem } from '@/types/gallery';
import { TEMPLATES, FONT_SIZE_MAP } from '@/constants/templates';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get config from gallery
    const item = await kv.get<GalleryItem>(`gallery:${params.id}`);

    if (!item) {
      return new Response('Not found', { status: 404 });
    }

    const config = item.config;
    const template = TEMPLATES[config.template];

    // Generate image using @vercel/og
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: config.backgroundColor,
            fontSize: FONT_SIZE_MAP[config.fontSize],
            fontWeight: 'bold',
            color: config.textColor,
          }}
        >
          {config.text}
        </div>
      ),
      {
        width: 800,
        height: 600,
      }
    );
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
```

### 3.3 Stats API

#### 3.3.1 POST /api/stats/[id]/download

**Purpose:** ダウンロード数をインクリメント

**Request:**

```typescript
POST /api/stats/[id]/download
```

**Response:**

```typescript
{
  "success": true,
  "data": {
    "downloads": 43
  }
}
```

**Implementation:**

```typescript
// src/app/api/stats/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newCount = await kv.hincrby(`stats:${params.id}`, 'downloads', 1);

    // Update sorted set for downloads
    await kv.zadd('gallery:sorted:downloads', {
      score: newCount,
      member: params.id,
    });

    return NextResponse.json({
      success: true,
      data: { downloads: newCount },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update stats',
      },
      { status: 500 }
    );
  }
}
```

## 4. Error Handling

### 4.1 Error Response Format

All API responses follow a consistent format:

```typescript
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
```

### 4.2 Error Codes

```typescript
const ERROR_CODES = {
  // Client errors (4xx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',

  // Server errors (5xx)
  GENERATION_FAILED: 'GENERATION_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
```

### 4.3 Error Handling Utility

```typescript
function handleAPIError(error: unknown): APIResponse {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: error.message,
      code: ERROR_CODES.VALIDATION_ERROR,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      success: false,
      error: 'Resource not found',
      code: ERROR_CODES.NOT_FOUND,
    };
  }

  console.error('Unhandled error:', error);
  return {
    success: false,
    error: 'An unexpected error occurred',
    code: ERROR_CODES.UNKNOWN_ERROR,
  };
}
```

## 5. Rate Limiting (Phase 2)

### 5.1 Rate Limit Strategy

```typescript
// Using Vercel KV for rate limiting
async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}`;
  const limit = 100; // requests per hour
  const window = 3600; // 1 hour in seconds

  const current = await kv.incr(key);

  if (current === 1) {
    await kv.expire(key, window);
  }

  return current <= limit;
}
```

### 5.2 Rate Limit Headers

```typescript
const rateLimitHeaders = {
  'X-RateLimit-Limit': '100',
  'X-RateLimit-Remaining': '95',
  'X-RateLimit-Reset': '1698451200',
};
```

## 6. API Documentation

### 6.1 OpenAPI Specification (Optional)

For Phase 2, generate an OpenAPI/Swagger spec:

```yaml
openapi: 3.0.0
info:
  title: LGTM Generator API
  version: 1.0.0
  description: API for generating and managing LGTM images

paths:
  /api/gallery:
    get:
      summary: Get gallery items
      parameters:
        - in: query
          name: page
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GalleryResponse'
```

## 7. Testing

### 7.1 API Testing Utilities

```typescript
// Test helper for API routes
async function testAPIRoute(
  handler: Function,
  options: {
    method?: string;
    body?: any;
    params?: Record<string, string>;
  }
): Promise<Response> {
  const request = new NextRequest(
    new Request('http://localhost:3000/api/test', {
      method: options.method || 'GET',
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  );

  return handler(request, { params: options.params || {} });
}
```

## 8. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-21 | Initial | 初版作成 |
