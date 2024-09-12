(() => {
  const FBV_CANVAS_ID = "fbv-full-viewport-container";
  const USER_SETTINGS = {
    shortcutKey: "q",
    autoTheater: false,
  };

  const ytbRightControlEle = document.querySelector(".ytp-right-controls");
  const ytpChromeBottomEle = document.querySelector(".ytp-chrome-bottom");

  let isFullViewport = false;
  let containerParentEle = null;
  let originalVideoCss = null;
  let videoEle = null;

  let fullViewportModeEle = document.querySelector("#ytp-full-viewport-button");

  if (!fullViewportModeEle) {
    fullViewportModeEle = createFullViewportButton();
    const ytbFullScreenButtonEle = document.querySelector(
      "button.ytp-fullscreen-button"
    );

    ytbRightControlEle &&
      ytbRightControlEle.insertBefore(
        fullViewportModeEle,
        ytbFullScreenButtonEle
      );
  }

  chrome.storage.local.get(["autoTheater"], ({ autoTheater }) => {
    debugger;
    if (autoTheater) {
      USER_SETTINGS.autoTheater = autoTheater;
    }

    if (USER_SETTINGS.autoTheater) {
      setTimeout(() => {
        makeVideoFullViewport();
      }, 500);
    }
  });

  function createFullViewportButton() {
    const button = document.createElement("button");
    button.id = "ytp-full-viewport-button";
    button.classList.add("ytp-button", "ytp-full-viewport-button");
    button.title = `Full Viewport (${USER_SETTINGS.shortcutKey})`;

    const buttonImg = document.createElement("img");
    buttonImg.src = chrome.runtime.getURL("assets/icon_sans_bg.svg");
    buttonImg.style.height = "100%";
    buttonImg.style.width = "100%";
    buttonImg.style.boxSizing = "border-box";
    buttonImg.style.padding = "12px";
    button.appendChild(buttonImg);

    button.addEventListener("click", onClickFullViewportBtn);
    window.addEventListener("keydown", (e) => {
      if (e.key == USER_SETTINGS.shortcutKey) {
        onClickFullViewportBtn();
      } else if (e.key === "Escape") {
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

    containerParentEle = player.parentElement;
    videoEle = player.querySelector("video");
    originalVideoCss = videoEle.style.cssText;

    videoEle.style.height = "100vh";
    videoEle.style.width = "100vw";
    videoEle.style.top = "0px";
    videoEle.style.left = "0px";
    videoEle.style.objectFit = "contain";

    ytpChromeBottomEle.style.width = `${document.body.clientWidth - 12}px`;

    const canvas = createFullViewportCanvas();

    document.body.style.overflow = "hidden";
    document.body.appendChild(canvas);
    canvas.appendChild(player);

    isFullViewport = true;
  }

  function createFullViewportCanvas() {
    const canvas = document.createElement("div");

    canvas.id = FBV_CANVAS_ID;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "9999";
    canvas.style.background = "black";

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

    ytpChromeBottomEle.style.width = "";

    document.body.style.overflow = "";
    document.body.removeChild(canvas);
    videoEle.style.cssText = originalVideoCss;

    isFullViewport = false;
  }

  function getVideoPlayer() {
    const player =
      document.querySelector("#full-viewport-container:has(#ytd-player)") ||
      document.querySelector("#ytd-player");

    return player;
  }
})();
