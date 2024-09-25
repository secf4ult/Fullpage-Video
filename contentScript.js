(() => {
  const FBV_CANVAS_ID = 'fbv-full-viewport-container';
  const USER_SETTINGS = {
    shortcutKey: 'q',
    autoTheater: false,
  };

  let isFullViewport = false;
  let containerParentEle = null;
  let originalVideoCss = null;
  let videoEle = null;

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type } = obj;

    if (type === 'WATCH') {
      init();
    }
  });

  async function init() {
    await waitForPlayerLoaded();
    makeVideoTheater();

    const { isAutoTheater } = await chrome.storage.local.get(['isAutoTheater']);
    USER_SETTINGS.autoTheater = isAutoTheater;

    if (USER_SETTINGS.autoTheater) {
      makeVideoFullViewport();
    }
  }

  async function waitForPlayerLoaded() {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          const hasPlayerLoaded =
            mutation.target.id === 'container' &&
            mutation.addedNodes[0] &&
            mutation.addedNodes[0].id === 'movie_player';

          if (hasPlayerLoaded) {
            observer.disconnect();
            resolve();
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 500);
    });
  }

  function makeVideoTheater() {
    const ytbRightControlEle = document.querySelector('.ytp-right-controls');
    let fullViewportModeEle = document.querySelector(
      '#ytp-full-viewport-button'
    );

    if (!fullViewportModeEle) {
      fullViewportModeEle = createFullViewportButton();
      const ytbFullScreenButtonEle = document.querySelector(
        'button.ytp-fullscreen-button'
      );

      ytbRightControlEle &&
        ytbRightControlEle.insertBefore(
          fullViewportModeEle,
          ytbFullScreenButtonEle
        );
    }
  }

  function createFullViewportButton() {
    const button = document.createElement('button');
    button.id = 'ytp-full-viewport-button';
    button.classList.add('ytp-button', 'ytp-full-viewport-button');
    button.title = `Full Viewport (${USER_SETTINGS.shortcutKey})`;

    const buttonImg = document.createElement('img');
    buttonImg.src = chrome.runtime.getURL('assets/icon_sans_bg.svg');
    buttonImg.style.height = '100%';
    buttonImg.style.width = '100%';
    buttonImg.style.boxSizing = 'border-box';
    buttonImg.style.padding = '12px';
    button.appendChild(buttonImg);

    button.addEventListener('click', onClickFullViewportBtn);
    document.body.addEventListener('keydown', (e) => {
      if (e.key == USER_SETTINGS.shortcutKey) {
        onClickFullViewportBtn();
      } else if (e.key === 'Escape') {
        restoreVideo();
      }
    });

    return button;
  }

  function onClickFullViewportBtn() {
    if (isFullViewport) {
      restoreVideo();
    } else {
      makeVideoFullViewport();
    }
  }

  function makeVideoFullViewport() {
    const player = getVideoPlayer();
    if (!player) {
      return;
    }

    // change player to full viewport
    containerParentEle = player.parentElement;
    videoEle = player.querySelector('video');
    originalVideoCss = videoEle.style.cssText;

    videoEle.style.height = '100vh';
    videoEle.style.width = '100vw';
    videoEle.style.top = '0px';
    videoEle.style.left = '0px';
    videoEle.style.objectFit = 'contain';

    // create full viewport canvas
    const canvas = createFullViewportCanvas();
    canvas.appendChild(player);

    // change progress bar to full viewport
    const ytbChromeBottomEle = document.querySelector('.ytp-chrome-bottom');
    ytbChromeBottomEle.style.width = `${document.body.clientWidth - 12}px`;

    isFullViewport = true;
  }

  function createFullViewportCanvas() {
    const canvas = document.createElement('div');

    canvas.id = FBV_CANVAS_ID;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
    canvas.style.background = 'black';

    document.body.style.overflow = 'hidden';
    document.body.appendChild(canvas);

    return canvas;
  }

  function restoreVideo() {
    const canvas = document.querySelector(`#${FBV_CANVAS_ID}`);
    if (!canvas) {
      return;
    }

    const player = getVideoPlayer();

    containerParentEle.appendChild(player);
    containerParentEle = null;

    const ytbChromeBottomEle = document.querySelector('.ytp-chrome-bottom');
    ytbChromeBottomEle.style.width = '';

    document.body.style.overflow = '';
    document.body.removeChild(canvas);
    videoEle.style.cssText = originalVideoCss;

    isFullViewport = false;
  }

  function getVideoPlayer() {
    const player =
      document.querySelector('#full-viewport-container:has(#ytd-player)') ||
      document.querySelector('#ytd-player');

    return player;
  }
})();
