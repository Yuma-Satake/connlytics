'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

type UseEditorPageResult = {
  markdown: string;
  setMarkdown: (value: string) => void;
  eventTitle: string | undefined;
  eventUrl: string | undefined;
};

/**
 * エディタページのURLパラメータからmarkdown, title, urlを取得するhooks
 */
export const useEditorPage = (): UseEditorPageResult => {
  const searchParams = useSearchParams();

  const markdownParam = searchParams.get('markdown');
  const titleParam = searchParams.get('title');
  const urlParam = searchParams.get('url');

  const initialMarkdown = markdownParam
    ? decodeURIComponent(markdownParam)
    : '';

  const [markdown, setMarkdown] = useState(initialMarkdown);

  return {
    markdown,
    setMarkdown,
    eventTitle: titleParam ?? undefined,
    eventUrl: urlParam ?? undefined,
  };
};
