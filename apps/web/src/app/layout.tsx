import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Connlytics - connpassイベント主催者向け機能拡張ツール',
  description:
    'connpassイベント説明文のMarkdownをリアルタイムでプレビュー・編集',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
