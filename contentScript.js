(() => {
  const ytbRightControl = document.querySelector(".ytp-right-controls");
  const ytbFullScreenButton = document.querySelector(
    "button.ytp-fullscreen-button"
  );

  let fullPageModeEle = document.querySelector("#ytp-fullpage-button");
  let isFullPage = false;

  if (!fullPageModeEle) {
    fullPageModeEle = document.createElement("button");
    fullPageModeEle.id = "ytp-fullpage-button";
    fullPageModeEle.classList.add("ytp-button", "ytp-fullscreen-button");
    fullPageModeEle.title = "Full Page";
    fullPageModeEle.addEventListener("click", () => {
      const video = document.querySelector("#container.ytd-player");

      if (isFullPage) {
        restoreVideo(video);
      } else {
        makeVideoFullPage(video);
      }
      isFullPage = !isFullPage;
    });

    // const buttonImg = document.createElement("img");
    // buttonImg.src = "assets/icon.png";

    // fullPageModeEle.appendChild(buttonImg);
    ytbRightControl.insertBefore(fullPageModeEle, ytbFullScreenButton);
  }
})();

function makeVideoFullPage(video) {
  video.style.position = "fixed";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.zIndex = "9999";
  video.style.background = "black";
}

function restoreVideo(video) {
  video.style.position = "";
  video.style.top = "";
  video.style.left = "";
  video.style.width = "";
  video.style.height = "";
  video.style.zIndex = "";
  video.style.background = "";
}
