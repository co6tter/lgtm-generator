# Data Design Specification

## 1. Overview

### 1.1 Data Storage Strategy

無料範囲での実装のため、以下の段階的なアプローチを採用：

**Phase 1 (MVP):**
- クライアントサイドのみ（LocalStorage）
- URLパラメータによる状態の共有
- 永続化なし（ブラウザベース）

**Phase 2 (Optional):**
- Vercel KV（無料枠: 256MB）
- 生成画像のメタデータ保存
- ギャラリー機能用

### 1.2 Data Flow

```
User Input → State Management → Canvas Generation → Output
                ↓
         LocalStorage (Optional)
                ↓
         URL Parameters (Sharing)
```

## 2. Data Models

### 2.1 Core Data Structures

#### 2.1.1 LGTMConfig (画像生成設定)

```typescript
interface LGTMConfig {
  // 識別子
  id?: string;                    // UUID v4 (共有時のみ)

  // テキスト設定
  text: string;                   // 表示テキスト (max 50 chars)

  // スタイル設定
  template: TemplateType;         // テンプレート種別
  fontSize: FontSize;             // フォントサイズ
  textColor: string;              // テキスト色 (hex)
  backgroundColor: string;        // 背景色 (hex)
  textPosition: TextPosition;     // テキスト位置

  // メタデータ
  createdAt?: string;             // ISO 8601 format
  updatedAt?: string;             // ISO 8601 format
}
```

**Type Definitions:**

```typescript
type TemplateType =
  | 'classic'
  | 'dark'
  | 'minimal'
  | 'vibrant'
  | 'retro';

type FontSize = 'small' | 'medium' | 'large';

type TextPosition = 'top' | 'center' | 'bottom';
```

**Example:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "text": "LGTM",
  "template": "classic",
  "fontSize": "medium",
  "textColor": "#FFFFFF",
  "backgroundColor": "#3B82F6",
  "textPosition": "center",
  "createdAt": "2025-10-21T10:30:00.000Z",
  "updatedAt": "2025-10-21T10:30:00.000Z"
}
```

#### 2.1.2 Template (テンプレート定義)

```typescript
interface Template {
  id: TemplateType;
  name: string;
  description: string;
  thumbnail: string;              // URL or path
  defaultConfig: {
    fontSize: FontSize;
    textColor: string;
    backgroundColor: string;
    backgroundGradient?: Gradient;
    textPosition: TextPosition;
    fontFamily?: string;
  };
}

interface Gradient {
  type: 'linear' | 'radial';
  colors: string[];               // Array of hex colors
  angle?: number;                 // For linear gradients (degrees)
}
```

**Example:**

```json
{
  "id": "classic",
  "name": "Classic",
  "description": "Blue gradient background with white text",
  "thumbnail": "/templates/classic.png",
  "defaultConfig": {
    "fontSize": "medium",
    "textColor": "#FFFFFF",
    "backgroundColor": "#3B82F6",
    "backgroundGradient": {
      "type": "linear",
      "colors": ["#3B82F6", "#1E40AF"],
      "angle": 135
    },
    "textPosition": "center"
  }
}
```

#### 2.1.3 GalleryItem (ギャラリーアイテム - Phase 2)

```typescript
interface GalleryItem {
  id: string;                     // UUID v4
  config: LGTMConfig;             // 画像設定
  imageUrl: string;               // 生成画像のURL (optional)
  metadata: {
    downloads: number;            // ダウンロード回数
    views: number;                // 閲覧回数
    isPublic: boolean;            // 公開設定
    tags?: string[];              // タグ (将来用)
  };
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
}
```

**Example:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "config": {
    "text": "Looks Good!",
    "template": "vibrant",
    "fontSize": "large",
    "textColor": "#FFFFFF",
    "backgroundColor": "#FF6B6B",
    "textPosition": "center"
  },
  "imageUrl": "/api/images/a1b2c3d4-e5f6-7890-abcd-ef1234567890.png",
  "metadata": {
    "downloads": 42,
    "views": 156,
    "isPublic": true,
    "tags": ["colorful", "fun"]
  },
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T15:30:00.000Z"
}
```

### 2.2 State Management Structures

#### 2.2.1 EditorState (エディター状態)

```typescript
interface EditorState {
  currentConfig: LGTMConfig;
  history: LGTMConfig[];          // Undo/redo用 (Phase 2)
  historyIndex: number;
  isGenerating: boolean;          // 生成中フラグ
  error: string | null;           // エラーメッセージ
}
```

#### 2.2.2 GalleryState (ギャラリー状態 - Phase 2)

```typescript
interface GalleryState {
  items: GalleryItem[];
  filter: GalleryFilter;
  isLoading: boolean;
  hasMore: boolean;               // ページネーション用
  page: number;
}

interface GalleryFilter {
  sortBy: 'latest' | 'popular' | 'downloads';
  searchQuery: string;
  tags?: string[];
}
```

## 3. Storage Solutions

### 3.1 Browser LocalStorage (Phase 1)

**Purpose:** ユーザーの最近の設定を保存

**Storage Keys:**

```typescript
const STORAGE_KEYS = {
  RECENT_CONFIGS: 'lgtm_recent_configs',      // Array<LGTMConfig>
  USER_PREFERENCES: 'lgtm_user_preferences',  // UserPreferences
  LAST_CONFIG: 'lgtm_last_config',            // LGTMConfig
} as const;
```

**UserPreferences:**

```typescript
interface UserPreferences {
  defaultTemplate: TemplateType;
  language: 'en' | 'ja';
  theme: 'light' | 'dark';        // Future
}
```

**Storage Limits:**
- LocalStorage: ~5-10MB (ブラウザ依存)
- 最大20件の最近の設定を保存
- 古い設定は自動削除（FIFO）

**Implementation:**

```typescript
// Save config
const saveConfig = (config: LGTMConfig): void => {
  const recent = getRecentConfigs();
  recent.unshift(config);
  const limited = recent.slice(0, 20); // 最大20件
  localStorage.setItem(
    STORAGE_KEYS.RECENT_CONFIGS,
    JSON.stringify(limited)
  );
};

// Load configs
const getRecentConfigs = (): LGTMConfig[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RECENT_CONFIGS);
  return data ? JSON.parse(data) : [];
};
```

### 3.2 URL Parameters (Sharing)

**Purpose:** 設定の共有とディープリンク

**URL Format:**

```
https://lgtm-generator-v1.vercel.app/?config={base64_encoded_json}
```

**Or expanded format:**

```
https://lgtm-generator-v1.vercel.app/?
  text=LGTM&
  template=classic&
  fontSize=medium&
  textColor=FFFFFF&
  bgColor=3B82F6&
  position=center
```

**Encoding/Decoding:**

```typescript
// Encode config to URL
const encodeConfigToURL = (config: LGTMConfig): string => {
  const json = JSON.stringify(config);
  const base64 = btoa(json);
  return `${BASE_URL}?config=${base64}`;
};

// Decode config from URL
const decodeConfigFromURL = (url: string): LGTMConfig | null => {
  const params = new URLSearchParams(url);
  const encoded = params.get('config');

  if (!encoded) return null;

  try {
    const json = atob(encoded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};
```

**Fallback (Expanded format):**

```typescript
const parseExpandedParams = (params: URLSearchParams): Partial<LGTMConfig> => {
  return {
    text: params.get('text') || undefined,
    template: params.get('template') as TemplateType || undefined,
    fontSize: params.get('fontSize') as FontSize || undefined,
    textColor: params.get('textColor') ? `#${params.get('textColor')}` : undefined,
    backgroundColor: params.get('bgColor') ? `#${params.get('bgColor')}` : undefined,
    textPosition: params.get('position') as TextPosition || undefined,
  };
};
```

### 3.3 Vercel KV (Phase 2 - Optional)

**Purpose:** 公開ギャラリー、共有画像の永続化

**無料枠制限:**
- ストレージ: 256MB
- リクエスト: 3,000 commands/day
- 帯域幅: 100MB/day

**Data Schema:**

```typescript
// Key patterns
const KV_KEYS = {
  GALLERY_ITEM: (id: string) => `gallery:${id}`,
  GALLERY_LIST: 'gallery:list',
  GALLERY_SORTED_LATEST: 'gallery:sorted:latest',
  GALLERY_SORTED_POPULAR: 'gallery:sorted:popular',
  STATS: (id: string) => `stats:${id}`,
} as const;
```

**Storage Strategy:**

1. **Individual Items:**
   ```typescript
   // Store gallery item
   await kv.set(KV_KEYS.GALLERY_ITEM(id), galleryItem);

   // Get gallery item
   const item = await kv.get<GalleryItem>(KV_KEYS.GALLERY_ITEM(id));
   ```

2. **Sorted Lists (for pagination):**
   ```typescript
   // Add to sorted set (score = timestamp)
   await kv.zadd(KV_KEYS.GALLERY_SORTED_LATEST, {
     score: Date.now(),
     member: id,
   });

   // Get latest items (with pagination)
   const ids = await kv.zrange(
     KV_KEYS.GALLERY_SORTED_LATEST,
     0,
     19, // Get 20 items
     { rev: true } // Reverse order (latest first)
   );
   ```

3. **Stats Tracking:**
   ```typescript
   // Increment download count
   await kv.hincrby(KV_KEYS.STATS(id), 'downloads', 1);

   // Get stats
   const stats = await kv.hgetall(KV_KEYS.STATS(id));
   ```

**Optimization for free tier:**
- Cache frequent queries in memory
- Batch operations where possible
- Lazy load gallery items
- Implement aggressive caching (CDN + Browser cache)

## 4. Data Validation

### 4.1 Input Validation

```typescript
const validateLGTMConfig = (config: Partial<LGTMConfig>): ValidationResult => {
  const errors: string[] = [];

  // Text validation
  if (config.text !== undefined) {
    if (config.text.length === 0) {
      errors.push('Text cannot be empty');
    }
    if (config.text.length > 50) {
      errors.push('Text must be 50 characters or less');
    }
  }

  // Color validation (hex format)
  const hexColorRegex = /^#[0-9A-F]{6}$/i;
  if (config.textColor && !hexColorRegex.test(config.textColor)) {
    errors.push('Invalid text color format');
  }
  if (config.backgroundColor && !hexColorRegex.test(config.backgroundColor)) {
    errors.push('Invalid background color format');
  }

  // Enum validation
  const validTemplates: TemplateType[] = ['classic', 'dark', 'minimal', 'vibrant', 'retro'];
  if (config.template && !validTemplates.includes(config.template)) {
    errors.push('Invalid template');
  }

  const validFontSizes: FontSize[] = ['small', 'medium', 'large'];
  if (config.fontSize && !validFontSizes.includes(config.fontSize)) {
    errors.push('Invalid font size');
  }

  const validPositions: TextPosition[] = ['top', 'center', 'bottom'];
  if (config.textPosition && !validPositions.includes(config.textPosition)) {
    errors.push('Invalid text position');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

### 4.2 Sanitization

```typescript
const sanitizeText = (text: string): string => {
  // Remove potentially harmful characters
  return text
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .slice(0, 50); // Enforce max length
};

const sanitizeColor = (color: string): string => {
  // Ensure # prefix and valid hex
  const cleaned = color.replace(/[^0-9A-F#]/gi, '');
  if (cleaned.startsWith('#') && cleaned.length === 7) {
    return cleaned.toUpperCase();
  }
  return '#000000'; // Default to black if invalid
};
```

## 5. Default Values & Constants

### 5.1 Default Configuration

```typescript
const DEFAULT_CONFIG: LGTMConfig = {
  text: 'LGTM',
  template: 'classic',
  fontSize: 'medium',
  textColor: '#FFFFFF',
  backgroundColor: '#3B82F6',
  textPosition: 'center',
};
```

### 5.2 Template Definitions

```typescript
const TEMPLATES: Record<TemplateType, Template> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Blue gradient with white text',
    thumbnail: '/templates/classic.png',
    defaultConfig: {
      fontSize: 'medium',
      textColor: '#FFFFFF',
      backgroundColor: '#3B82F6',
      backgroundGradient: {
        type: 'linear',
        colors: ['#3B82F6', '#1E40AF'],
        angle: 135,
      },
      textPosition: 'center',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Dark background with green accent',
    thumbnail: '/templates/dark.png',
    defaultConfig: {
      fontSize: 'medium',
      textColor: '#10B981',
      backgroundColor: '#1F2937',
      textPosition: 'center',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white background',
    thumbnail: '/templates/minimal.png',
    defaultConfig: {
      fontSize: 'medium',
      textColor: '#111827',
      backgroundColor: '#FFFFFF',
      textPosition: 'center',
    },
  },
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Rainbow gradient background',
    thumbnail: '/templates/vibrant.png',
    defaultConfig: {
      fontSize: 'medium',
      textColor: '#FFFFFF',
      backgroundColor: '#FF6B6B',
      backgroundGradient: {
        type: 'linear',
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        angle: 90,
      },
      textPosition: 'center',
    },
  },
  retro: {
    id: 'retro',
    name: 'Retro',
    description: 'Vintage purple and yellow',
    thumbnail: '/templates/retro.png',
    defaultConfig: {
      fontSize: 'medium',
      textColor: '#FBBF24',
      backgroundColor: '#7C3AED',
      textPosition: 'center',
    },
  },
};
```

### 5.3 Canvas Settings

```typescript
const CANVAS_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  DPI: 2, // For retina displays
  FORMAT: 'image/png',
  QUALITY: 0.95,
} as const;

const FONT_SIZE_MAP: Record<FontSize, number> = {
  small: 32,
  medium: 48,
  large: 64,
};

const TEXT_POSITION_MAP: Record<TextPosition, number> = {
  top: 0.25,      // 25% from top
  center: 0.5,    // 50% from top
  bottom: 0.75,   // 75% from top
};
```

## 6. Data Migration & Versioning

### 6.1 Schema Versioning

```typescript
interface VersionedConfig {
  version: number;
  data: LGTMConfig;
}

const CURRENT_VERSION = 1;

const migrateConfig = (config: any): LGTMConfig => {
  const version = config.version || 0;

  if (version === CURRENT_VERSION) {
    return config.data;
  }

  // Migration logic for future versions
  let migrated = config.data;

  // Example: v0 -> v1 migration
  if (version === 0) {
    migrated = {
      ...migrated,
      textPosition: migrated.textPosition || 'center',
    };
  }

  return migrated;
};
```

### 6.2 LocalStorage Migration

```typescript
const migrateLocalStorage = (): void => {
  const version = localStorage.getItem('lgtm_version');

  if (version === CURRENT_VERSION.toString()) {
    return; // Already up to date
  }

  // Perform migration
  try {
    const oldConfigs = localStorage.getItem(STORAGE_KEYS.RECENT_CONFIGS);
    if (oldConfigs) {
      const parsed = JSON.parse(oldConfigs);
      const migrated = parsed.map(migrateConfig);
      localStorage.setItem(STORAGE_KEYS.RECENT_CONFIGS, JSON.stringify(migrated));
    }

    localStorage.setItem('lgtm_version', CURRENT_VERSION.toString());
  } catch (error) {
    console.error('Migration failed:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEYS.RECENT_CONFIGS);
  }
};
```

## 7. Performance Considerations

### 7.1 Caching Strategy

**Client-side:**
- Template definitions: Static, can be hardcoded
- Recent configs: Load once on mount, sync on changes
- User preferences: Load once, update on change

**Server-side (Phase 2):**
- Gallery list: Cache for 5 minutes
- Individual items: Cache for 1 hour
- CDN caching for generated images

### 7.2 Data Size Optimization

**Minimize storage:**
```typescript
// Instead of storing full config, store only diffs from template
const compressConfig = (config: LGTMConfig): CompressedConfig => {
  const template = TEMPLATES[config.template];
  const defaults = template.defaultConfig;

  const compressed: CompressedConfig = {
    t: config.template,
    txt: config.text !== 'LGTM' ? config.text : undefined,
    fs: config.fontSize !== defaults.fontSize ? config.fontSize : undefined,
    tc: config.textColor !== defaults.textColor ? config.textColor : undefined,
    bg: config.backgroundColor !== defaults.backgroundColor ? config.backgroundColor : undefined,
    pos: config.textPosition !== defaults.textPosition ? config.textPosition : undefined,
  };

  return compressed;
};

interface CompressedConfig {
  t: TemplateType;
  txt?: string;
  fs?: FontSize;
  tc?: string;
  bg?: string;
  pos?: TextPosition;
}
```

## 8. Data Security & Privacy

### 8.1 Privacy Considerations

**No PII Collection:**
- No user accounts required
- No tracking of personal data
- No analytics cookies (optional, privacy-friendly analytics only)

**User-generated content:**
- Text input sanitization
- No image upload (prevents NSFW content)
- Content filtering (future: bad word filter)

### 8.2 Data Retention

**LocalStorage:**
- User controls data (can clear browser storage)
- No server-side retention in Phase 1

**Vercel KV (Phase 2):**
- Public gallery items retained indefinitely (until manually deleted)
- Inactive items (no views/downloads for 6 months) may be archived
- Users can request deletion via issue tracker

## 9. Testing Data

### 9.1 Sample Configs for Testing

```typescript
const TEST_CONFIGS: LGTMConfig[] = [
  {
    text: 'LGTM',
    template: 'classic',
    fontSize: 'medium',
    textColor: '#FFFFFF',
    backgroundColor: '#3B82F6',
    textPosition: 'center',
  },
  {
    text: 'Looks Good!',
    template: 'vibrant',
    fontSize: 'large',
    textColor: '#FFFFFF',
    backgroundColor: '#FF6B6B',
    textPosition: 'center',
  },
  {
    text: 'すばらしい!',
    template: 'retro',
    fontSize: 'medium',
    textColor: '#FBBF24',
    backgroundColor: '#7C3AED',
    textPosition: 'center',
  },
  {
    text: 'Ship it! 🚀',
    template: 'dark',
    fontSize: 'large',
    textColor: '#10B981',
    backgroundColor: '#1F2937',
    textPosition: 'bottom',
  },
];
```

## 10. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-21 | Initial | 初版作成 |
