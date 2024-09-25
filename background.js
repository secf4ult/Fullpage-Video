// YouTube 'watch' page won't run contentScript.js if you clicked another video there,
// so there has to be a background job to monitor the url change
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const isCompleted = changeInfo.status === 'complete';
  const isTargetUrl = tab.url && tab.url.includes('youtube.com/watch');

  if (isCompleted && isTargetUrl) {
    chrome.tabs.sendMessage(tabId, {
      type: 'WATCH',
    });
  }
});
