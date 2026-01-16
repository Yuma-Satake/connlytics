const WEB_APP_URL = 'https://connlytics-web.vercel.app';

interface ExtractMarkdownPayload {
  title: string;
  url: string;
  markdown: string;
}

interface ExtractMarkdownMessage {
  type: 'EXTRACT_MARKDOWN';
  payload: ExtractMarkdownPayload;
}

chrome.runtime.onMessage.addListener(
  (message: ExtractMarkdownMessage, _sender, sendResponse) => {
    if (message.type === 'EXTRACT_MARKDOWN') {
      handleExtractMarkdown(message.payload);
      sendResponse({ success: true });
    }
    return true;
  }
);

const handleExtractMarkdown = async (
  payload: ExtractMarkdownPayload
): Promise<void> => {
  const { title, url, markdown } = payload;

  const editorUrl = new URL(`${WEB_APP_URL}/editor`);
  editorUrl.searchParams.set('title', title);
  editorUrl.searchParams.set('url', url);

  const tab = await chrome.tabs.create({ url: editorUrl.toString() });

  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
    if (tabId === tab.id && info.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener);

      if (tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: sendMessageToPage,
          args: [markdown, title, url],
        });
      }
    }
  });
};

const sendMessageToPage = (
  markdown: string,
  title: string,
  url: string
): void => {
  window.postMessage(
    {
      type: 'LOAD_MARKDOWN',
      payload: { markdown, eventTitle: title, eventUrl: url },
    },
    '*'
  );
};
