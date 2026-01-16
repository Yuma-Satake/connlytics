# Feature-Sliced Design ガイドライン

## 概要

本プロジェクトはFeature-Sliced Design（FSD）アーキテクチャを採用している。
このドキュメントでは、FSDの原則と本プロジェクトでの適用方法を定義する。

参考: https://feature-sliced.design/

## レイヤー構成

### 1. app

アプリケーション全体の初期化とグローバル設定を担当。

```
src/app/
├── (routes)/          # Next.js App Router ルーティング
│   ├── layout.tsx     # ルートレイアウト
│   ├── page.tsx       # ホームページ
│   └── editor/
│       └── page.tsx   # エディタページ
├── providers/         # グローバルプロバイダー
│   ├── index.tsx
│   └── theme-provider.tsx
└── styles/            # グローバルスタイル
    └── globals.css
```

**責務**:
- Next.js App Routerの設定
- グローバルプロバイダー（Theme, Supabase等）
- グローバルスタイル

### 2. pages

ページ単位の構成ロジックを担当。Next.js App Routerと連携。

```
src/pages/
└── editor/
    ├── ui/
    │   └── editor-page.tsx   # ページコンポーネント
    ├── model/
    │   └── use-editor-page.ts
    └── index.ts              # Public API
```

**責務**:
- ページレベルの状態管理
- Widgets/Featuresの組み合わせ
- レイアウト構成

**注意**: Next.js App Routerの`page.tsx`はルーティングのみを担当し、
実際のページコンポーネントはこのレイヤーからインポートする。

### 3. widgets

独立した複合UIブロックを担当。

```
src/widgets/
└── markdown-editor/
    ├── ui/
    │   ├── markdown-editor.tsx
    │   ├── editor-pane.tsx
    │   └── preview-pane.tsx
    ├── model/
    │   └── use-markdown-editor.ts
    └── index.ts
```

**責務**:
- 複数のFeaturesやEntitiesを組み合わせたUIブロック
- ウィジェット固有の状態管理
- 独立して動作可能な単位

### 4. features

ユーザーアクションやビジネス機能を担当。

```
src/features/
├── export-markdown/
│   ├── ui/
│   │   ├── copy-button.tsx
│   │   └── download-button.tsx
│   ├── model/
│   │   └── use-export.ts
│   └── index.ts
└── preview-markdown/
    ├── ui/
    │   └── markdown-preview.tsx
    ├── model/
    │   └── use-preview.ts
    ├── lib/
    │   └── markdown-parser.ts
    └── index.ts
```

**責務**:
- ユーザーが実行するアクション
- ビジネスロジック
- 単一の機能に対する責任

### 5. entities

ビジネスエンティティとドメインモデルを担当。

```
src/entities/
├── event/
│   ├── model/
│   │   ├── types.ts
│   │   └── store.ts
│   ├── api/
│   │   └── event-api.ts
│   └── index.ts
└── markdown/
    ├── model/
    │   └── types.ts
    └── index.ts
```

**責務**:
- ドメインモデルの定義
- エンティティの状態管理
- エンティティ関連のAPI

### 6. shared

再利用可能なコードを担当。ビジネスロジックを含まない。

```
src/shared/
├── ui/                    # UIコンポーネント（shadcn/ui）
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── lib/                   # ユーティリティ関数
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── api/                   # API基盤
│   └── fetch.ts
└── config/                # 設定・定数
    └── constants.ts
```

**責務**:
- UIプリミティブ（shadcn/ui）
- ユーティリティ関数
- API基盤
- 設定・定数

## Segment構成

各Slice内で使用可能なSegment:

| Segment | 用途 |
|---------|------|
| `ui/` | UIコンポーネント |
| `model/` | ビジネスロジック、状態管理、型定義 |
| `api/` | API通信 |
| `lib/` | ユーティリティ関数 |
| `config/` | 設定、定数 |
| `index.ts` | Public API（必須） |

## Public API規則

各Sliceは`index.ts`でPublic APIを定義する。

```typescript
// features/export-markdown/index.ts

// UI
export { CopyButton } from './ui/copy-button';
export { DownloadButton } from './ui/download-button';

// Model
export { useExport } from './model/use-export';

// Types
export type { ExportOptions } from './model/types';
```

外部からは`index.ts`経由でのみアクセス可能:

```typescript
// OK
import { CopyButton } from '@/features/export-markdown';

// NG - 直接参照禁止
import { CopyButton } from '@/features/export-markdown/ui/copy-button';
```

## 依存ルール

### 許可される依存

```
app     -> pages, widgets, features, entities, shared
pages   -> widgets, features, entities, shared
widgets -> features, entities, shared
features -> entities, shared
entities -> shared
shared  -> (外部ライブラリのみ)
```

### 禁止される依存

1. **下位から上位への依存**
   ```typescript
   // NG: entities から features への依存
   // src/entities/event/model/store.ts
   import { useExport } from '@/features/export-markdown'; // 禁止
   ```

2. **同一レイヤー内のSlice間依存**
   ```typescript
   // NG: features/A から features/B への依存
   // src/features/export-markdown/model/use-export.ts
   import { usePreview } from '@/features/preview-markdown'; // 禁止
   ```

## Steiger設定

FSDの依存ルールをSteigerでリント:

```typescript
// steiger.config.ts
import fsd from '@feature-sliced/steiger-plugin';

export default {
  plugins: [fsd],
  rules: {
    'fsd/no-relative-imports': 'error',
    'fsd/no-cross-slice-imports': 'error',
    'fsd/no-layer-violations': 'error',
    'fsd/public-api': 'error',
  },
};
```

## ESLint設定

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@feature-sliced/eslint-config'],
  // ...
};
```

## パス設定

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

## 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| Slice名 | kebab-case | `export-markdown`, `markdown-editor` |
| ファイル名 | kebab-case | `copy-button.tsx`, `use-export.ts` |
| コンポーネント名 | PascalCase | `CopyButton`, `MarkdownEditor` |
| Hook名 | camelCase (use prefix) | `useExport`, `useMarkdownEditor` |
| 型名 | PascalCase | `ExportOptions`, `EventData` |
