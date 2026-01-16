interface PageStatus {
  isConnpassEvent: boolean;
  eventTitle: string | null;
}

const checkCurrentPage = async (): Promise<PageStatus> => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id || !tab.url?.includes('connpass.com/event/')) {
      return { isConnpassEvent: false, eventTitle: null };
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'GET_PAGE_STATUS',
    });

    return {
      isConnpassEvent: response.isConnpassEvent,
      eventTitle: response.eventTitle,
    };
  } catch {
    return { isConnpassEvent: false, eventTitle: null };
  }
};

const handleEditClick = async (): Promise<void> => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab.id) return;

  await chrome.tabs.sendMessage(tab.id, {
    type: 'REQUEST_EXTRACT',
  });

  window.close();
};

const renderEventDetected = (eventTitle: string | null): void => {
  const contentEl = document.getElementById('content');
  if (!contentEl) return;

  contentEl.innerHTML = `
    <div class="event-detected">
      <p class="status-text">connpassイベントを検出</p>
      ${eventTitle ? `<p class="event-title">${eventTitle}</p>` : ''}
      <button class="edit-button" id="editBtn">MDを編集する</button>
    </div>
  `;

  const editBtn = document.getElementById('editBtn');
  editBtn?.addEventListener('click', handleEditClick);
};

const renderNoEvent = (): void => {
  const contentEl = document.getElementById('content');
  if (!contentEl) return;

  contentEl.innerHTML = `
    <div class="no-event">
      <p class="status-text">
        connpassのイベントページで<br>ご利用ください
      </p>
      <p class="hint">
        対応ページ:<br>
        connpass.com/event/xxx/
      </p>
    </div>
  `;
};

const init = async (): Promise<void> => {
  const status = await checkCurrentPage();

  if (status.isConnpassEvent) {
    renderEventDetected(status.eventTitle);
  } else {
    renderNoEvent();
  }
};

document.addEventListener('DOMContentLoaded', init);
