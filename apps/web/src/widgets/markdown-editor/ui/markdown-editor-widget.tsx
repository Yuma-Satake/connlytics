'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import type React from 'react';
import { CopyButton, DownloadButton } from '@/features/export-markdown';
import { MarkdownPreview } from '@/features/preview-markdown';
import { cn } from '@/shared/lib';

type MarkdownEditorWidgetProps = {
  markdown: string;
  onMarkdownChange: (value: string) => void;
  eventTitle?: string;
  eventUrl?: string;
};

/**
 * A markdown editor widget with live preview
 */
export const MarkdownEditorWidget = ({
  markdown,
  onMarkdownChange,
  eventTitle,
  eventUrl,
}: MarkdownEditorWidgetProps): React.JSX.Element => {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-primary">Connlytics</h1>
          {eventTitle && (
            <p className="text-sm text-muted-foreground">{eventTitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {eventUrl && (
            <a
              href={eventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline mr-4"
            >
              connpassで開く
            </a>
          )}
          <CopyButton markdown={markdown} />
          <DownloadButton markdown={markdown} filename={eventTitle} />
        </div>
      </header>

      {/* Desktop: 2-pane layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r flex flex-col">
          <div className="px-4 py-2 border-b bg-muted/50">
            <span className="text-sm font-medium">Markdown</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => onMarkdownChange(e.target.value)}
            className="flex-1 resize-none font-mono text-sm p-4 focus:outline-none"
            placeholder="Markdownを入力..."
            spellCheck={false}
          />
        </div>
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b bg-muted/50">
            <span className="text-sm font-medium">プレビュー</span>
          </div>
          <div className="flex-1 overflow-auto">
            <MarkdownPreview markdown={markdown} />
          </div>
        </div>
      </div>

      {/* Mobile: Tab layout */}
      <Tabs defaultValue="editor" className="flex-1 md:hidden flex flex-col">
        <TabsList className="flex border-b">
          <TabsTrigger
            value="editor"
            className={cn(
              'flex-1 py-2 text-sm font-medium',
              'data-[state=active]:border-b-2 data-[state=active]:border-primary'
            )}
          >
            エディタ
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className={cn(
              'flex-1 py-2 text-sm font-medium',
              'data-[state=active]:border-b-2 data-[state=active]:border-primary'
            )}
          >
            プレビュー
          </TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="flex-1">
          <textarea
            value={markdown}
            onChange={(e) => onMarkdownChange(e.target.value)}
            className="w-full h-full resize-none font-mono text-sm p-4 focus:outline-none"
            placeholder="Markdownを入力..."
            spellCheck={false}
          />
        </TabsContent>
        <TabsContent value="preview" className="flex-1 overflow-auto">
          <MarkdownPreview markdown={markdown} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
