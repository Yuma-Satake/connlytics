interface PageInfo {
  isEventPage: boolean;
  isEditPage: boolean;
  eventId: string | null;
}

interface EventInfo {
  title: string;
  url: string;
  markdown: string;
}

const detectConnpassPage = (): PageInfo => {
  const url = window.location.href;
  const eventMatch = url.match(/connpass\.com\/event\/(\d+)/);
  const isEditPage = url.includes('/edit/');

  return {
    isEventPage: Boolean(eventMatch),
    isEditPage,
    eventId: eventMatch ? eventMatch[1] : null,
  };
};

/**
 * イベントタイトルを取得する
 * 編集ページではinput要素から、通常ページではh1要素から取得
 */
const getEventTitle = (): string | null => {
  const titleInput = document.querySelector<HTMLInputElement>(
    'input[name="title"]'
  );
  if (titleInput?.value) {
    return titleInput.value.trim();
  }

  const titleElement = document.querySelector(
    '.event_title, h1.title'
  ) as HTMLElement | null;
  return titleElement?.textContent?.trim() ?? null;
};

/**
 * イベント説明のMarkdownを抽出する
 * 編集ページではtextareaから、通常ページではDOM要素から変換
 */
const extractMarkdown = (): string => {
  const textarea = document.querySelector<HTMLTextAreaElement>(
    'textarea[name="description_input"]'
  );
  if (textarea) {
    return textarea.value;
  }

  const descriptionElement = document.querySelector(
    '.event_description, .description'
  ) as HTMLElement | null;
  if (descriptionElement) {
    return htmlToMarkdown(descriptionElement.innerHTML);
  }

  return '';
};

const htmlToMarkdown = (html: string): string => {
  let markdown = html;

  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i>(.*?)<\/i>/gi, '*$1*');
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  markdown = markdown.replace(
    /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    '[$2]($1)'
  );
  markdown = markdown.replace(
    /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
    '![$2]($1)'
  );
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  markdown = markdown.replace(/<ul[^>]*>|<\/ul>/gi, '\n');
  markdown = markdown.replace(/<ol[^>]*>|<\/ol>/gi, '\n');
  markdown = markdown.replace(
    /<blockquote[^>]*>(.*?)<\/blockquote>/gi,
    '> $1\n'
  );
  markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`');
  markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n');
  markdown = markdown.replace(/<hr\s*\/?>/gi, '\n---\n');
  markdown = markdown.replace(/<[^>]+>/g, '');
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  return markdown.trim();
};

interface GetPageStatusMessage {
  type: 'GET_PAGE_STATUS';
}

interface RequestExtractMessage {
  type: 'REQUEST_EXTRACT';
}

type ContentMessage = GetPageStatusMessage | RequestExtractMessage;

chrome.runtime.onMessage.addListener(
  (message: ContentMessage, _sender, sendResponse) => {
    const pageInfo = detectConnpassPage();

    if (message.type === 'GET_PAGE_STATUS') {
      sendResponse({
        isConnpassEvent: pageInfo.isEventPage,
        eventTitle: getEventTitle(),
      });
    } else if (message.type === 'REQUEST_EXTRACT') {
      const eventInfo: EventInfo = {
        title: getEventTitle() || 'connpassイベント',
        url: window.location.href,
        markdown: extractMarkdown(),
      };

      chrome.runtime.sendMessage({
        type: 'EXTRACT_MARKDOWN',
        payload: eventInfo,
      });

      sendResponse({ success: true });
    }

    return true;
  }
);
