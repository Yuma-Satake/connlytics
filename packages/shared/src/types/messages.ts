/**
 * Chrome拡張 <-> Webアプリ間の通信メッセージ型
 */

export type EditorMessage = {
  type: 'LOAD_MARKDOWN';
  payload: {
    markdown: string;
    eventTitle: string;
    eventUrl: string;
  };
};

export type ExtractMarkdownMessage = {
  type: 'EXTRACT_MARKDOWN';
  payload: {
    title: string;
    url: string;
    markdown: string;
  };
};

export type RequestExtractMessage = {
  type: 'REQUEST_EXTRACT';
};

export type PageStatusMessage = {
  type: 'PAGE_STATUS';
  payload: {
    isConnpassEvent: boolean;
    eventTitle?: string;
  };
};

export type GetPageStatusMessage = {
  type: 'GET_PAGE_STATUS';
};

export type ChromeMessage =
  | ExtractMarkdownMessage
  | RequestExtractMessage
  | PageStatusMessage
  | GetPageStatusMessage;
