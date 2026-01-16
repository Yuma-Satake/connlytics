'use client';

import { useEffect, useState } from 'react';
import type { EditorMessage } from '@/shared/types/messages';

type UseEditorPageResult = {
  markdown: string;
  setMarkdown: (value: string) => void;
  eventTitle: string | undefined;
  eventUrl: string | undefined;
};

export const useEditorPage = (): UseEditorPageResult => {
  const [markdown, setMarkdown] = useState('');
  const [eventTitle, setEventTitle] = useState<string | undefined>();
  const [eventUrl, setEventUrl] = useState<string | undefined>();

  useEffect(() => {
    const handleMessage = (event: MessageEvent): void => {
      const message = event.data as EditorMessage;
      if (message?.type === 'LOAD_MARKDOWN') {
        setMarkdown(message.payload.markdown);
        setEventTitle(message.payload.eventTitle);
        setEventUrl(message.payload.eventUrl);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return {
    markdown,
    setMarkdown,
    eventTitle,
    eventUrl,
  };
};
