'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type UseEditorPageResult = {
  markdown: string;
  setMarkdown: (value: string) => void;
  eventTitle: string | undefined;
  eventUrl: string | undefined;
};

export const useEditorPage = (): UseEditorPageResult => {
  const searchParams = useSearchParams();

  const markdownParam = searchParams.get('markdown');
  const titleParam = searchParams.get('title');
  const urlParam = searchParams.get('url');

  const [markdown, setMarkdown] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && markdownParam) {
      setMarkdown(markdownParam);
      setIsInitialized(true);
    }
  }, [markdownParam, isInitialized]);

  return {
    markdown,
    setMarkdown,
    eventTitle: titleParam ?? undefined,
    eventUrl: urlParam ?? undefined,
  };
};
