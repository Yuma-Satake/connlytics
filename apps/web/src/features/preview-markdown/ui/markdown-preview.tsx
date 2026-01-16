'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { parseMarkdown } from '../lib/markdown-parser';
import 'highlight.js/styles/github.css';

type MarkdownPreviewProps = {
  markdown: string;
};

const DEBOUNCE_DELAY_MS = 100;

/**
 * Renders a markdown preview with syntax highlighting
 */
export const MarkdownPreview = ({
  markdown,
}: MarkdownPreviewProps): React.JSX.Element => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await parseMarkdown(markdown);
      if (!cancelled) {
        setHtml(result);
      }
    }, DEBOUNCE_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [markdown]);

  return (
    <div
      className="connpass-preview max-w-none p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
