import Link from 'next/link';
import type React from 'react';
import { Button } from '@/shared/ui';

/**
 * Home page component that displays the landing page
 */
export const HomePage = (): React.JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Connlytics</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            connpassイベント主催者向け
            <br />
            機能拡張ツール
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            イベント説明文のMarkdownをリアルタイムでプレビュー。
            <br />
            connpassスタイルで確認しながら編集できます。
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/editor">エディタを開く</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chrome拡張を入手
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold mb-2">connpassでイベント編集</h3>
            <p className="text-sm text-muted-foreground">
              connpassのイベント編集ページを開く
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold mb-2">拡張機能でMDを取得</h3>
            <p className="text-sm text-muted-foreground">
              Chrome拡張のボタンをクリック
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold mb-2">プレビューしながら編集</h3>
            <p className="text-sm text-muted-foreground">
              リアルタイムプレビューで確認
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Connlytics - connpassイベント主催者向け機能拡張ツール
        </div>
      </footer>
    </div>
  );
};
