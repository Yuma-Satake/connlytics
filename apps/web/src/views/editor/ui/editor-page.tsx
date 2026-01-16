'use client';

import type React from 'react';
import { MarkdownEditorWidget } from '@/widgets/markdown-editor';
import { useEditorPage } from '../model/use-editor-page';

/**
 * Editor page component that provides markdown editing with live preview
 */
export const EditorPage = (): React.JSX.Element => {
  const { markdown, setMarkdown, eventTitle, eventUrl } = useEditorPage();

  return (
    <div className="h-screen flex flex-col">
      <MarkdownEditorWidget
        markdown={markdown}
        onMarkdownChange={setMarkdown}
        eventTitle={eventTitle}
        eventUrl={eventUrl}
      />
    </div>
  );
};
