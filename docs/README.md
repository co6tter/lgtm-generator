# LGTM Generator - Documentation

## Overview

LGTM Generatorは、コードレビューで使用できるカスタマイズ可能なLGTM（Looks Good To Me）画像を簡単に生成・共有できるWebアプリケーションです。

## Documentation Index

### 1. [Requirements Specification](./01_requirements.md)
プロジェクトの要件定義書

**主な内容:**
- プロジェクト概要と目的
- スコープ（Phase 1: MVP、Phase 2: 拡張機能）
- 機能要件（画像生成、カスタマイズ、共有機能）
- 非機能要件（パフォーマンス、ユーザビリティ、互換性）
- 制約条件（Vercel無料枠での運用）
- リリース計画とリスク管理

**対象読者:** プロジェクトマネージャー、開発者全員

---

### 2. [UI/UX Design Specification](./02_uiux-design.md)
UI/UXデザイン仕様書

**主な内容:**
- デザイン哲学と原則
- ユーザージャーニーとフロー
- 画面レイアウト（Desktop/Mobile）
- コンポーネント仕様
  - TextInput, TemplateSelector, ColorPicker等
  - PreviewCanvas, ActionButtons
  - GalleryGrid, GalleryItem
- ビジュアルデザイン
  - カラーパレット
  - タイポグラフィ
  - スペーシング、影、角丸
- インタラクション & アニメーション
- レスポンシブデザイン
- アクセシビリティ（WCAG 2.1 AA準拠）

**対象読者:** デザイナー、フロントエンド開発者

---

### 3. [Data Design Specification](./03_data-design.md)
データ設計仕様書

**主な内容:**
- データストレージ戦略
  - Phase 1: LocalStorage（クライアントサイド）
  - Phase 2: Vercel KV（オプション）
- データモデル
  - `LGTMConfig`: 画像生成設定
  - `Template`: テンプレート定義
  - `GalleryItem`: ギャラリーアイテム
- ストレージソリューション
  - Browser LocalStorage実装
  - URLパラメータエンコーディング
  - Vercel KV統合（Phase 2）
- データバリデーション & サニタイゼーション
- デフォルト値と定数定義
- データマイグレーション & バージョニング
- パフォーマンス最適化（キャッシング、圧縮）

**対象読者:** バックエンド開発者、フロントエンド開発者

---

### 4. [API Design Specification](./04_api-design.md)
API設計仕様書

**主な内容:**
- API戦略（Phase 1: クライアントサイドのみ、Phase 2: サーバーサイド）
- クライアントサイドAPI
  - `generateLGTMImage()`: Canvas APIベースの画像生成
  - `downloadImage()`: 画像ダウンロード
  - `copyToClipboard()`: クリップボードコピー
  - `shareImage()`: Web Share API
  - LocalStorage API
  - URL エンコーディング/デコーディング
- サーバーサイドAPI（Phase 2）
  - `GET/POST /api/gallery`: ギャラリー管理
  - `GET /api/gallery/[id]`: アイテム取得
  - `GET /api/images/[id]`: サーバーサイド画像生成
  - `POST /api/stats/[id]/download`: 統計更新
- エラーハンドリング
- レート制限（Phase 2）

**対象読者:** フロントエンド開発者、バックエンド開発者

---

### 5. [Architecture Specification](./05_architecture.md)
システムアーキテクチャ仕様書

**主な内容:**
- システム全体概要
- 技術スタック
  - Frontend: Next.js 14+, React 18+, TypeScript, Tailwind CSS, Zustand
  - Backend: Next.js API Routes, Vercel KV
  - Deployment: Vercel
- フロントエンドアーキテクチャ
  - ディレクトリ構造
  - コンポーネント階層
  - 状態管理（Zustand stores）
  - カスタムフック
- バックエンドアーキテクチャ（Phase 2）
  - API レイヤー
  - データレイヤー（Vercel KV）
  - キャッシング戦略
- デプロイメントアーキテクチャ
  - Vercelデプロイメント
  - ビルド & デプロイパイプライン
  - 環境設定
- パフォーマンス最適化
- セキュリティアーキテクチャ
- モニタリング & ロギング
- テスト戦略

**対象読者:** テックリード、アーキテクト、全開発者

---

## Quick Start

### For Developers

1. **要件確認**: [01_requirements.md](./01_requirements.md)を読んで、プロジェクトの全体像を把握
2. **アーキテクチャ理解**: [05_architecture.md](./05_architecture.md)で技術スタックと構造を理解
3. **実装開始**:
   - Frontend: [02_uiux-design.md](./02_uiux-design.md) + [04_api-design.md](./04_api-design.md)
   - Data/State: [03_data-design.md](./03_data-design.md)

### For Designers

1. **デザイン要件**: [01_requirements.md](./01_requirements.md)のScope & Functional Requirementsを確認
2. **UI/UX仕様**: [02_uiux-design.md](./02_uiux-design.md)を詳細に読む
3. **デザイン作成**: Figmaなどでモックアップ作成（仕様書を参照）

### For Project Managers

1. **プロジェクト概要**: [01_requirements.md](./01_requirements.md)の全体を確認
2. **リリース計画**: Requirements > Release Planセクション参照
3. **進捗管理**: 各フェーズの成果物を確認

---

## Document Structure

各ドキュメントは以下の構造に従っています：

```
1. Overview / 概要
2. Detailed Specification / 詳細仕様
3. Examples / 実装例（コードスニペット）
4. Best Practices / ベストプラクティス
5. Future Considerations / 将来の拡張
6. Revision History / 改訂履歴
```

---

## Technology Stack Summary

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 15.5.6 (App Router) | React フレームワーク |
| **Language** | TypeScript 5+ | 型安全な開発 |
| **UI** | React 19.1.0 | UIライブラリ |
| **Styling** | Tailwind CSS 4+ (PostCSS) | ユーティリティファーストCSS |
| **State** | Zustand (to be added) | 軽量な状態管理 |
| **Image Gen** | Canvas API | クライアントサイド画像生成 |
| **Icons** | Heroicons / Lucide React (to be added) | アイコンライブラリ |
| **Hosting** | Vercel | デプロイメントプラットフォーム |
| **Database** | Vercel KV (Phase 2) | Redis互換KVストア |
| **Package Manager** | pnpm | 高速なパッケージマネージャー |

**Current Dependencies:**
```json
{
  "dependencies": {
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "next": "15.5.6"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.5.6",
    "@eslint/eslintrc": "^3"
  }
}
```

---

## Project Phases

### Phase 1 - MVP (v0.1.0) ✅ Current Target

**Goal:** 基本的な画像生成とダウンロード機能

**Features:**
- テキスト入力とリアルタイムプレビュー
- 3-5種類のテンプレート
- カラーカスタマイズ（テキスト、背景）
- フォントサイズと位置調整
- PNG画像ダウンロード
- クリップボードコピー（URL）
- レスポンシブデザイン

**Tech:**
- クライアントサイドのみ（Canvas API）
- LocalStorage（設定保存）
- URLパラメータ（共有）

**Duration:** 2-3週間（想定）

---

### Phase 2 - Enhanced (v0.2.0) 🔜 Next

**Goal:** ギャラリー機能とサーバーサイド統合

**Features:**
- 公開ギャラリー
- 画像一覧とフィルタリング
- 直接リンク共有（永続化）
- 統計情報（閲覧数、ダウンロード数）
- テンプレート追加（10種類）

**Tech:**
- Next.js API Routes
- Vercel KV
- サーバーサイド画像生成（@vercel/og）

**Duration:** 2-3週間（想定）

---

### Phase 3 - Community (v0.3.0) 🔮 Future

**Goal:** コミュニティ機能

**Features:**
- ユーザー認証（GitHub OAuth）
- マイページ
- お気に入り機能
- カスタムテンプレート投稿
- コメント機能

**Tech:**
- NextAuth.js
- Vercel Postgres (optional)

**Duration:** TBD

---

## Development Workflow

### 1. Setup

```bash
# Clone repository
git clone https://github.com/co6tter/lgtm-generator.git
cd lgtm-generator

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### 2. Development

```bash
# Run linter
pnpm lint

# Type check (using tsc)
pnpm exec tsc --noEmit

# Format code (to be added: prettier)
# pnpm format

# Run tests (when implemented)
# pnpm test
```

**Note:**
- `pnpm dev` uses Turbopack for faster development
- Prettier is not yet configured (to be added)

### 3. Build & Deploy

```bash
# Build for production
pnpm build

# Preview production build
pnpm start

# Deploy to Vercel (automatic on push to main)
git push origin main
```

---

## Coding Standards

### TypeScript

- すべての関数に型定義
- `any`型の使用を避ける
- Strict mode有効

### React

- 関数コンポーネント優先
- Hooks使用
- Propsに型定義

### Styling

- Tailwind CSS utilityクラス優先
- カスタムCSSは最小限
- レスポンシブデザイン必須

### File Organization

- Feature-based directory structure
- Colocation of related files
- Barrel exports (`index.ts`)

---

## Key Design Decisions

### Why Next.js?

- SSG/SSRのハイブリッド対応
- API Routes（サーバーサイド機能）
- Vercelとのシームレスな統合
- 優れた開発者体験

### Why Zustand?

- 軽量（~1KB）
- シンプルなAPI
- TypeScript完全対応
- Redux DevTools対応

### Why Canvas API?

- クライアントサイドで完結
- サーバー負荷なし
- リアルタイムプレビュー
- ブラウザ標準API

### Why Vercel KV?

- 無料枠が十分（256MB）
- Redis互換（高速）
- Vercel統合
- セットアップ簡単

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| First Contentful Paint | < 1.5s | 初回表示 |
| Time to Interactive | < 3s | インタラクション可能まで |
| Image Generation | < 1s | Canvas描画時間 |
| Download Action | < 500ms | クリックから保存まで |
| Lighthouse Score | > 90 | Performance, Accessibility, Best Practices |

---

## Accessibility Requirements

- **WCAG 2.1 Level AA** 準拠
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 十分なカラーコントラスト（4.5:1以上）
- Focus indicatorの明確な表示
- ARIA属性の適切な使用

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |
| iOS Safari | Latest 2 versions |
| Chrome Mobile | Latest 2 versions |

**Minimum Requirements:**
- ES2020サポート
- Canvas API
- LocalStorage API
- Clipboard API（optional、fallback有）

---

## Security Considerations

### Input Validation

- すべてのユーザー入力をサニタイズ
- 文字数制限の厳格な適用
- XSS対策（エスケープ処理）

### API Security

- Rate limiting（Phase 2）
- CORS設定
- HTTPS必須

### Data Privacy

- 個人情報収集なし
- トラッキングなし（またはプライバシー重視の分析のみ）
- LocalStorageのみ（ユーザーがコントロール可能）

---

## Troubleshooting

### Common Issues

**1. Canvas画像がぼやける**
- Solution: DPI設定を2に（Retina対応）

**2. モバイルでプレビューが表示されない**
- Solution: Canvas要素のレスポンシブ対応を確認

**3. ダウンロードが動作しない**
- Solution: ブラウザのセキュリティ設定、CORS確認

**4. LocalStorageが保存されない**
- Solution: プライベートモード確認、容量確認

---

## Contributing

### Documentation Updates

ドキュメントの更新手順：

1. 該当ドキュメントを編集
2. Revision Historyに変更履歴を追記
3. バージョン番号をインクリメント
4. プルリクエストを作成

### Issue Reporting

バグや改善提案は[GitHub Issues](https://github.com/co6tter/lgtm-generator/issues)へ

---

## Resources

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### Design Resources

- [Heroicons](https://heroicons.com/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind UI](https://tailwindui.com/)

---

## License

TBD (MITを推奨)

---

## Contact

- **Repository**: https://github.com/co6tter/lgtm-generator
- **Issues**: https://github.com/co6tter/lgtm-generator/issues

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-21 | Initial | 初版作成 |

---

**Last Updated:** 2025-10-21

**Documentation Status:** ✅ Complete (Phase 1)
