# Requirements Specification

## 1. Project Overview

### 1.1 Project Name
**LGTM Generator** - コードレビュー用のLGTM画像を生成するWebアプリケーション

### 1.2 Purpose
プルリクエストやコードレビューで使用できる、カスタマイズ可能なLGTM（Looks Good To Me）画像を簡単に生成・共有できるサービスを提供する。

### 1.3 Target Users
- ソフトウェア開発者
- コードレビュアー
- GitHubユーザー
- 開発チームメンバー

## 2. Scope

### 2.1 In Scope (無料範囲での実装)

#### Core Features
1. **画像生成機能**
   - テキスト入力による LGTM 画像生成
   - テンプレート選択（5-10種類のプリセット）
   - カスタムテキスト入力（"LGTM"以外も対応）
   - プレビュー機能

2. **画像カスタマイズ**
   - テキストカラー変更
   - フォントサイズ調整
   - 背景色選択
   - テンプレート選択

3. **ダウンロード・共有機能**
   - PNG形式でダウンロード
   - クリップボードへコピー
   - 直接リンク生成（URL経由でアクセス可能）

4. **ギャラリー機能**
   - 最近生成された画像の表示（公開設定されたもの）
   - シンプルなフィルタリング（日付順、人気順）

#### Technical Requirements
- **Frontend**: React / Next.js (App Router)
- **Styling**: Tailwind CSS
- **Image Generation**: Canvas API または SVG
- **Hosting**: Vercel（無料プラン）
- **Storage**: Browser LocalStorage（永続化はオプション）
- **Database**: なし（初期版）または Vercel KV（無料枠）

### 2.2 Out of Scope (Phase 1)

以下は初期実装では含めず、将来的な拡張として検討：

1. **ユーザー認証機能**
   - ユーザー登録・ログイン
   - マイページ機能

2. **高度な画像編集**
   - レイヤー機能
   - 画像フィルター
   - アニメーションGIF生成

3. **外部API連携**
   - GitHub API連携
   - Unsplash等の画像API

4. **有料機能**
   - 広告なし
   - プレミアムテンプレート
   - 高解像度エクスポート

## 3. Functional Requirements

### 3.1 画像生成

**FR-001: テキスト入力**
- ユーザーは任意のテキストを入力できる
- デフォルト値は "LGTM"
- 最大文字数: 50文字
- 複数行対応（最大3行）

**FR-002: テンプレート選択**
- 最低5種類のプリセットテンプレート
- 各テンプレートは以下を含む：
  - 背景スタイル（単色、グラデーション）
  - デフォルトフォント
  - デフォルト配色

**FR-003: カスタマイズオプション**
- テキスト色変更（カラーピッカー）
- 背景色変更（カラーピッカー）
- フォントサイズ（小・中・大）
- テキスト位置（上・中・下）

**FR-004: プレビュー**
- リアルタイムプレビュー表示
- 変更が即座に反映される

### 3.2 ダウンロード・共有

**FR-005: ダウンロード**
- PNG形式でダウンロード（推奨サイズ: 800x600px）
- ファイル名形式: `lgtm_YYYYMMDD_HHMMSS.png`

**FR-006: クリップボードコピー**
- ワンクリックで画像URLまたはMarkdown記法をコピー
- コピー成功のトースト通知表示

**FR-007: 直接リンク**
- 生成した画像に一意のURLを付与
- URLパラメータで画像を再現可能
- 例: `/generate?text=LGTM&bg=blue&color=white`

### 3.3 ギャラリー

**FR-008: ギャラリー表示**
- グリッドレイアウトで画像一覧表示
- 1ページあたり12-24画像
- レスポンシブデザイン（モバイル対応）

**FR-009: フィルタリング**
- 並び順: 新着順、ダウンロード数順
- シンプルな検索（テキストマッチ）

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR-001**: 初回ロード時間 < 3秒
- **NFR-002**: 画像生成時間 < 1秒
- **NFR-003**: モバイルでの動作もスムーズ

### 4.2 Usability
- **NFR-004**: 直感的なUI（説明なしで使える）
- **NFR-005**: アクセシビリティ対応（WCAG 2.1 AA準拠を目指す）
- **NFR-006**: 日本語・英語対応

### 4.3 Compatibility
- **NFR-007**: モダンブラウザ対応（Chrome, Firefox, Safari, Edge 最新版）
- **NFR-008**: モバイルブラウザ対応（iOS Safari, Chrome Mobile）
- **NFR-009**: レスポンシブデザイン（320px - 1920px幅）

### 4.4 Security
- **NFR-010**: XSS対策（入力値のサニタイゼーション）
- **NFR-011**: HTTPS通信
- **NFR-012**: 不適切なコンテンツフィルタリング（将来的に）

### 4.5 Scalability
- **NFR-013**: Vercel無料枠内での運用
- **NFR-014**: 静的生成を活用してサーバー負荷を最小化

## 5. Constraints

### 5.1 Technical Constraints
- **C-001**: Vercel無料プランの制限内で運用
  - 帯域幅制限: 100GB/月
  - 実行時間制限: 10秒/リクエスト
  - ビルド時間: 6時間/月

- **C-002**: 外部有料サービスは使用しない
- **C-003**: データベースは使わないかVercel KV無料枠のみ

### 5.2 Business Constraints
- **C-004**: 無料で提供
- **C-005**: 広告表示なし（初期版）
- **C-006**: オープンソースプロジェクトとして公開

### 5.3 Time Constraints
- **C-007**: MVP（Minimum Viable Product）を優先
- **C-008**: 段階的な機能追加

## 6. Acceptance Criteria

### 6.1 MVP Success Criteria
1. ユーザーがテキストを入力して画像を生成できる
2. 生成した画像をダウンロードできる
3. 最低3種類のテンプレートが選択できる
4. モバイルとデスクトップの両方で動作する
5. Vercelにデプロイして公開されている

### 6.2 Quality Criteria
1. ページロード時間が3秒以内
2. バグがなくスムーズに動作する
3. UIが直感的で使いやすい
4. 生成画像の品質が十分（ぼやけていない）

## 7. Release Plan

### Phase 1 - MVP (v0.1.0)
- 基本的な画像生成機能
- 3種類のテンプレート
- ダウンロード機能
- 静的サイトとしてデプロイ

### Phase 2 - Enhanced (v0.2.0)
- テンプレート追加（10種類まで）
- ギャラリー機能
- 直接リンク共有
- カスタマイズオプション拡充

### Phase 3 - Community (v0.3.0)
- 簡易的な保存機能（LocalStorage）
- お気に入り機能
- テンプレート投稿機能（検討）

## 8. Risk Management

| Risk ID | Risk Description | Probability | Impact | Mitigation |
|---------|------------------|-------------|--------|------------|
| R-001 | Vercel無料枠の制限超過 | Medium | High | 静的生成を最大活用、CDN活用 |
| R-002 | Canvas APIのブラウザ互換性問題 | Low | Medium | フォールバック実装、ブラウザ検出 |
| R-003 | 不適切な画像生成 | Medium | Medium | 入力バリデーション、将来的にフィルタリング |
| R-004 | パフォーマンス低下 | Low | Medium | 画像サイズ最適化、lazy loading |

## 9. Appendix

### 9.1 Glossary
- **LGTM**: "Looks Good To Me" の略。コードレビューで承認の意を示す
- **MVP**: Minimum Viable Product（実用最小限の製品）
- **Canvas API**: HTMLのCanvas要素を使った画像生成API

### 9.2 References
- Next.js Documentation: https://nextjs.org/docs
- Vercel Free Plan: https://vercel.com/pricing
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

### 9.3 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-21 | Initial | 初版作成 |
