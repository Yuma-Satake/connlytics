# アーキテクチャ

## システム構成図

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              クライアント                                │
├─────────────────────────────────┬───────────────────────────────────────┤
│        Chrome拡張機能            │           Webアプリケーション          │
│                                 │                                       │
│  ┌─────────────────────────┐   │   ┌─────────────────────────────┐    │
│  │     Content Script      │   │   │        Next.js App          │    │
│  │  - connpassページ検知    │   │   │                             │    │
│  │  - DOM解析              │   │   │  ┌─────────────────────┐   │    │
│  │  - MD抽出               │   │   │  │   MDエディタ         │   │    │
│  └──────────┬──────────────┘   │   │  │                     │   │    │
│             │                   │   │  └─────────────────────┘   │    │
│  ┌──────────▼──────────────┐   │   │                             │    │
│  │     Background Script   │   │   │  ┌─────────────────────┐   │    │
│  │  - 通信管理             │   │   │  │   MDプレビュー       │   │    │
│  │  - Webアプリ連携        │◀──┼──▶│  │                     │   │    │
│  └─────────────────────────┘   │   │  └─────────────────────┘   │    │
│                                 │   │                             │    │
│  ┌─────────────────────────┐   │   └─────────────────────────────┘    │
│  │     Popup UI            │   │                                       │
│  │  - 編集ボタン           │   │                                       │
│  │  - ステータス表示        │   │                                       │
│  └─────────────────────────┘   │                                       │
└─────────────────────────────────┴───────────────────────────────────────┘
```

## コンポーネント詳細

### Chrome拡張機能

| コンポーネント | 役割 |
|--------------|------|
| Content Script | connpassのイベントページを検知し、DOMからMarkdownを抽出 |
| Background Script | Content ScriptとWebアプリ間の通信を管理 |
| Popup UI | ユーザーインターフェース（編集ボタン等） |

### Webアプリケーション

| コンポーネント | 役割 |
|--------------|------|
| MDエディタ | Markdownの編集機能を提供 |
| MDプレビュー | connpassスタイルでのリアルタイムプレビュー |

## 通信フロー

### Markdownプレビュー機能

```
1. ユーザーがconnpassのイベントページを開く
2. Content Scriptがページを検知
3. ユーザーがPopupの「編集」ボタンをクリック
4. Content Scriptがイベント説明のMarkdownを抽出
5. Background Scriptを経由してWebアプリに送信
6. WebアプリがMarkdownエディタ画面を表示
7. ユーザーが編集・プレビューを実行
```

## Feature-Sliced Design (FSD)

WebアプリケーションはFeature-Sliced Design（FSD）アーキテクチャを採用。
スケーラブルで保守性の高いフロントエンド構造を実現する。

### FSDレイヤー構造

```
上位レイヤー（依存される側）
    ↑
    │  app      ... アプリ全体の設定、プロバイダー、グローバル設定
    │  pages    ... ルーティング、ページコンポーネント
    │  widgets  ... 独立した複合UIブロック
    │  features ... ユーザーシナリオ、ビジネス機能
    │  entities ... ビジネスエンティティ、ドメインモデル
    │  shared   ... 再利用可能なコード、UI基盤、ユーティリティ
    ↓
下位レイヤー（依存する側）
```

### レイヤー詳細

| レイヤー | 役割 | 例 |
|---------|------|-----|
| `app` | アプリ初期化、プロバイダー、グローバルスタイル | providers, global styles |
| `pages` | ルーティング、ページ構成 | EditorPage, HomePage |
| `widgets` | 独立した複合UIブロック | MarkdownEditorWidget |
| `features` | ユーザーアクション、ビジネス機能 | export-markdown, copy-to-clipboard |
| `entities` | ビジネスエンティティ | event, markdown |
| `shared` | 再利用可能なコード | ui, lib, api, config |

### Slice構造（各レイヤー内）

```
feature-name/
├── ui/          # UIコンポーネント
├── model/       # ビジネスロジック、状態管理
├── api/         # API通信
├── lib/         # ユーティリティ
├── config/      # 設定
└── index.ts     # Public API
```

### 依存ルール

1. **上位レイヤーは下位レイヤーにのみ依存可能**
   - features -> entities, shared (OK)
   - entities -> features (NG)

2. **同一レイヤー内のSlice間は依存禁止**
   - features/A -> features/B (NG)

3. **Public APIのみ参照**
   - 各Sliceは `index.ts` で公開されたもののみ外部参照可能

## ディレクトリ構成

```
connlytics/
├── docs/                        # ドキュメント
├── apps/
│   └── web/                     # Next.js Webアプリ (FSD)
│       ├── src/
│       │   ├── app/             # [FSD] App層 + Next.js App Router
│       │   │   ├── (routes)/    # Next.js ルーティング
│       │   │   ├── providers/   # グローバルプロバイダー
│       │   │   └── styles/      # グローバルスタイル
│       │   ├── pages/           # [FSD] Pages層（ページ構成ロジック）
│       │   │   └── editor/
│       │   │       ├── ui/
│       │   │       └── index.ts
│       │   ├── widgets/         # [FSD] Widgets層
│       │   │   └── markdown-editor/
│       │   │       ├── ui/
│       │   │       ├── model/
│       │   │       └── index.ts
│       │   ├── features/        # [FSD] Features層
│       │   │   ├── export-markdown/
│       │   │   │   ├── ui/
│       │   │   │   ├── model/
│       │   │   │   └── index.ts
│       │   │   └── preview-markdown/
│       │   │       ├── ui/
│       │   │       ├── model/
│       │   │       └── index.ts
│       │   ├── entities/        # [FSD] Entities層
│       │   │   ├── event/
│       │   │   │   ├── model/
│       │   │   │   └── index.ts
│       │   │   └── markdown/
│       │   │       ├── model/
│       │   │       └── index.ts
│       │   └── shared/          # [FSD] Shared層
│       │       ├── ui/          # shadcn/ui コンポーネント
│       │       ├── lib/         # ユーティリティ関数
│       │       ├── api/         # API クライアント
│       │       └── config/      # 定数、設定
│       └── ...
├── packages/
│   ├── extension/               # Chrome拡張機能
│   │   ├── src/
│   │   │   ├── background/      # Background Script
│   │   │   ├── content/         # Content Script
│   │   │   ├── popup/           # Popup UI
│   │   │   └── shared/          # 拡張機能内共有コード
│   │   └── manifest.json
│   └── shared/                  # モノレポ全体の共有コード
│       └── src/
│           └── types/           # 共有型定義
├── steiger.config.ts            # FSDリンター設定
└── package.json                 # モノレポ設定
```

## 技術選定

### Webアプリケーション

| 技術 | 選定理由 |
|-----|---------|
| Next.js 14+ | App Routerによるモダンな開発体験、SSG対応 |
| TypeScript | 型安全性の確保 |
| React 18+ | 最新のReact機能を活用 |
| shadcn/ui | Radix UI + Tailwind CSSベースの高品質UIコンポーネント |
| Tailwind CSS | ユーティリティファーストのCSS、shadcn/uiの基盤 |

### バックエンド

| 技術 | 選定理由 |
|-----|---------|
| Supabase | PostgreSQL、認証、ストレージを統合したBaaS |
| Supabase Auth | ソーシャルログイン対応の認証基盤 |
| Supabase Database | PostgreSQLベースのリアルタイムDB |

### アーキテクチャ

| 技術 | 選定理由 |
|-----|---------|
| Feature-Sliced Design | スケーラブルで保守性の高いフロントエンド構造 |
| Steiger | FSDアーキテクチャのリンター |
| @feature-sliced/eslint-config | FSD準拠のESLintルール |

### Chrome拡張機能

| 技術 | 選定理由 |
|-----|---------|
| Manifest V3 | Chrome拡張の最新仕様、セキュリティ向上 |
| TypeScript | 型安全性の確保、コード品質向上 |

### 開発環境

| ツール | 用途 |
|-------|------|
| pnpm | パッケージマネージャー（モノレポ対応） |
| Turborepo | モノレポビルド最適化 |
| ESLint | コード品質管理 |
| Prettier | コードフォーマット |
| Lefthook | Gitフック管理（pre-commit, pre-push等） |
