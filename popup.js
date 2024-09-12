const autoTheaterOpEle = document.querySelector("#auto_theater_option");

chrome.storage.local.get("autoTheater").then(({ autoTheater }) => {
  autoTheaterOpEle.checked = autoTheater;
});

const onChangeAutoTheater = (val) => {
  chrome.storage.local.set({ autoTheater: val.target.checked });
};

autoTheaterOpEle.addEventListener("change", onChangeAutoTheater);
