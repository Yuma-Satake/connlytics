# Connlytics

connpassイベント主催者向け機能拡張ツール

## 概要

Connlyticsは、エンジニア向けイベントプラットフォーム「connpass」のイベント主催者向けに不足している機能を補完するツールです。

Webアプリケーションとchrome拡張機能の2つのコンポーネントで構成され、connpassとシームレスに連携して主催者の作業効率を向上させます。

## 主な機能

### Phase 1（初期リリース）

- **Markdownプレビュー機能**: イベント説明文のMarkdownをリアルタイムでプレビュー

### Phase 2以降（将来実装）

- **参加者分析**: 継続参加者の特定、継続率分析
- **イベント統計**: 参加者データの可視化・分析

## システム構成

```
┌─────────────────────────────────────────────────────────────┐
│                      ユーザー                                │
└─────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
┌─────────────────────┐            ┌─────────────────────┐
│   Chrome拡張機能     │◀──────────▶│   Webアプリ          │
│                     │            │   (Next.js + FSD)   │
│ - connpassページ検知 │            │                     │
│ - MD取得・送信       │            │ - MDプレビュー       │
│                     │            │ - 編集機能           │
└─────────────────────┘            └──────────┬──────────┘
         │                                    │
         ▼                                    ▼
┌─────────────────────┐            ┌─────────────────────┐
│   connpass          │            │   Supabase          │
│   イベントページ     │            │ - 認証              │
└─────────────────────┘            │ - データベース       │
                                   │ - ストレージ         │
                                   └─────────────────────┘
```

## 技術スタック

- **Webアプリ**: Next.js, TypeScript, React, shadcn/ui, Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Auth, Storage)
- **アーキテクチャ**: Feature-Sliced Design (FSD), Steiger
- **Chrome拡張**: TypeScript, Chrome Extensions API (Manifest V3)
- **開発環境**: pnpm, Turborepo, ESLint, Prettier, Lefthook

## ドキュメント

- [アーキテクチャ](./architecture.md)
- [FSDガイドライン](./fsd-guidelines.md)
- [Webアプリケーション仕様](./webapp-spec.md)
- [Chrome拡張機能仕様](./extension-spec.md)
- [機能ロードマップ](./roadmap.md)
