chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const isCompleted = changeInfo.status === 'complete';
  const isTargetUrl = tab.url && tab.url.includes('youtube.com/watch');

  if (isCompleted && isTargetUrl) {
    chrome.tabs.sendMessage(tabId, {
      type: 'WATCH',
    });
  }
});
