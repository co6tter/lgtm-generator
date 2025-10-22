# LGTM Generator

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

## Overview

LGTM Generatorは、プルリクエストやコードレビューで使用できる、カスタマイズ可能なLGTM（Looks Good To Me）画像を簡単に生成・共有できるサービスです。

### Features (Planned)

- 🎨 カスタマイズ可能なLGTM画像生成
- 📱 レスポンシブデザイン（モバイル対応）
- 🎭 複数のテンプレート
- 🎨 カラーカスタマイズ
- 💾 ダウンロード & クリップボードコピー
- 🔗 直接リンク共有
- 🖼️ ギャラリー機能（Phase 2）

## Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4 (PostCSS)
- **State Management**: Zustand (to be added)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+ (推奨: 20.x LTS)
- pnpm 9+ (推奨)

### Installation

```bash
# Clone repository
git clone https://github.com/co6tter/lgtm-generator.git
cd lgtm-generator

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### Build

```bash
# Production build
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
lgtm-generator/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components (to be added)
│   ├── lib/              # Core library code (to be added)
│   ├── store/            # Zustand stores (to be added)
│   ├── types/            # TypeScript types (to be added)
│   └── constants/        # Constants & config (to be added)
├── public/               # Static assets
├── docs/                 # Documentation
└── tests/                # Tests (to be added)
```

詳細は [docs/05_architecture.md](docs/05_architecture.md) を参照してください。

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | 開発サーバー起動（Turbopack使用） |
| `pnpm build` | 本番ビルド（Turbopack使用） |
| `pnpm start` | 本番サーバー起動 |
| `pnpm lint` | ESLintによるコードチェック |

## Documentation

詳細なドキュメントは [docs/](docs/) ディレクトリを参照してください。

- [Requirements](docs/01_requirements.md) - 要件定義
- [UI/UX Design](docs/02_uiux-design.md) - UI/UX設計
- [Data Design](docs/03_data-design.md) - データ設計
- [API Design](docs/04_api-design.md) - API設計
- [Architecture](docs/05_architecture.md) - アーキテクチャ設計

## Roadmap

### Phase 1 - MVP (Current)

- [ ] 基本的な画像生成機能
- [ ] テンプレート実装（3-5種類）
- [ ] カスタマイズUI
- [ ] ダウンロード機能
- [ ] URLシェア機能

### Phase 2 - Enhanced

- [ ] ギャラリー機能
- [ ] Vercel KV統合
- [ ] サーバーサイド画像生成
- [ ] 統計情報

### Phase 3 - Community

- [ ] ユーザー認証
- [ ] カスタムテンプレート投稿
- [ ] お気に入り機能

## Dependencies to Add

Phase 1の実装に必要な追加ライブラリ：

```bash
# State management
pnpm add zustand

# Icons
pnpm add lucide-react

# Development tools (optional)
pnpm add -D prettier @ianvs/prettier-plugin-sort-imports
```

Phase 2で追加予定：

```bash
# Vercel KV
pnpm add @vercel/kv

# Server-side image generation
pnpm add @vercel/og
```

## Configuration

### Environment Variables

開発環境用の `.env.local` ファイルを作成：

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

本番環境（Vercel）では自動的に設定されます。

### TypeScript Path Alias

`tsconfig.json` で設定済み：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`@/` プレフィックスで `src/` 配下をインポート可能：

```typescript
import { Button } from '@/components/common/Button';
import type { LGTMConfig } from '@/types/config';
```

## Contributing

1. このリポジトリをフォーク
2. Feature branchを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. Branchにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## License

TBD (MITを推奨)

## Author

[@co6tter](https://github.com/co6tter)

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
