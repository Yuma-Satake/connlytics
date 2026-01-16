# Chrome拡張機能仕様

## 概要

connpassのイベントページからMarkdownを取得し、Webアプリと連携するChrome拡張機能。

## 機能一覧

### Phase 1: Markdown取得・連携機能

#### F-EXT-001: connpassページ検知

**概要**: connpassのイベントページを自動検知

**要件**:
- `connpass.com/event/*` URLパターンを検知
- イベントページにいる場合、Popupの状態を更新
- 非イベントページでは機能を無効化

**対象URL**:
- `https://connpass.com/event/{event_id}/`
- `https://connpass.com/event/{event_id}/edit/`

#### F-EXT-002: Markdown抽出

**概要**: イベント説明欄からMarkdownテキストを抽出

**要件**:
- イベント説明欄のDOM要素を特定
- Markdown形式のテキストを抽出
- 抽出失敗時のエラーハンドリング

**技術詳細**:
- Content Scriptでページ内のDOMを解析
- connpassの編集画面からtextareaの内容を取得
- または表示画面のHTMLをMarkdownに逆変換

#### F-EXT-003: Webアプリ連携

**概要**: 抽出したMarkdownをWebアプリに送信

**要件**:
- Webアプリを新しいタブで開く
- Markdownデータをパラメータとして渡す
- イベント情報（タイトル、URL）も送信

**通信方式**:
```
1. ユーザーが「編集」ボタンをクリック
2. Content ScriptがMarkdownを抽出
3. Background ScriptがWebアプリを新規タブで開く
4. URLパラメータまたはpostMessageでデータを送信
```

#### F-EXT-004: Popup UI

**概要**: 拡張機能のユーザーインターフェース

**要件**:
- connpassページかどうかの状態表示
- 「編集」ボタン（イベントページのみ有効）
- 設定へのリンク

## 画面仕様

### Popup画面

#### connpassイベントページの場合

```
┌─────────────────────────────┐
│  Connlytics                 │
├─────────────────────────────┤
│                             │
│  connpassイベントを検出      │
│                             │
│  イベント名:                │
│  [イベントタイトル]          │
│                             │
│  ┌───────────────────────┐  │
│  │    MDを編集する        │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

#### connpassイベントページ以外の場合

```
┌─────────────────────────────┐
│  Connlytics                 │
├─────────────────────────────┤
│                             │
│  connpassのイベントページで  │
│  ご利用ください              │
│                             │
│  対応ページ:                │
│  connpass.com/event/xxx/    │
│                             │
└─────────────────────────────┘
```

## 技術仕様

### Manifest V3設定

```json
{
  "manifest_version": 3,
  "name": "Connlytics",
  "version": "1.0.0",
  "description": "connpassイベント主催者向け機能拡張ツール",
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "https://connpass.com/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["https://connpass.com/event/*"],
      "js": ["content.js"]
    }
  ]
}
```

### Content Script

**ファイル**: `content.ts`

**責務**:
- ページのDOMを解析
- イベント情報を抽出
- Background Scriptとの通信

```typescript
interface EventInfo {
  title: string;
  url: string;
  markdown: string;
}

// connpassのイベント説明を取得
function extractEventInfo(): EventInfo | null;

// Background Scriptへメッセージ送信
function sendToBackground(eventInfo: EventInfo): void;
```

### Background Script

**ファイル**: `background.ts`

**責務**:
- Content ScriptとPopup間の通信管理
- Webアプリの起動
- データの受け渡し

```typescript
// Webアプリを開いてデータを渡す
function openEditorWithMarkdown(eventInfo: EventInfo): void;

// メッセージハンドリング
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // ...
});
```

### Popup Script

**ファイル**: `popup.ts`

**責務**:
- UI表示・更新
- ユーザー操作の受付
- Content Scriptへのアクション要求

```typescript
// 現在のタブがconnpassイベントページか確認
async function checkCurrentPage(): Promise<boolean>;

// 編集ボタンクリック時の処理
async function handleEditClick(): Promise<void>;
```

## メッセージ定義

### Content Script -> Background Script

```typescript
interface ExtractMarkdownMessage {
  type: 'EXTRACT_MARKDOWN';
  payload: {
    title: string;
    url: string;
    markdown: string;
  };
}
```

### Popup -> Content Script

```typescript
interface RequestExtractMessage {
  type: 'REQUEST_EXTRACT';
}
```

### Background Script -> Popup

```typescript
interface PageStatusMessage {
  type: 'PAGE_STATUS';
  payload: {
    isConnpassEvent: boolean;
    eventTitle?: string;
  };
}
```

## エラーハンドリング

| エラー | 対応 |
|-------|------|
| Markdown抽出失敗 | ユーザーにエラーメッセージを表示 |
| Webアプリ接続失敗 | リトライまたはエラー表示 |
| 非対応ページ | 機能を無効化し、案内を表示 |
