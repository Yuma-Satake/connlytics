const WEB_APP_URL = 'https://connlytics.com';

type ExtractMarkdownPayload = {
  title: string;
  url: string;
  markdown: string;
};

type ExtractMarkdownMessage = {
  type: 'EXTRACT_MARKDOWN';
  payload: ExtractMarkdownPayload;
};

chrome.runtime.onMessage.addListener(
  (message: ExtractMarkdownMessage, _sender, sendResponse) => {
    if (message.type === 'EXTRACT_MARKDOWN') {
      handleExtractMarkdown(message.payload);
      sendResponse({ success: true });
    }
    return true;
  }
);

/**
 * Markdownデータを含むURLでエディタページを開く
 */
const handleExtractMarkdown = async (
  payload: ExtractMarkdownPayload
): Promise<void> => {
  const { title, url, markdown } = payload;

  const editorUrl = new URL(`${WEB_APP_URL}/editor`);
  editorUrl.searchParams.set('title', title);
  editorUrl.searchParams.set('url', url);
  editorUrl.searchParams.set('markdown', encodeURIComponent(markdown));

  await chrome.tabs.create({ url: editorUrl.toString() });
};
