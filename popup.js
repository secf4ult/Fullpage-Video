const autoTheaterOpEle = document.querySelector('#auto_theater_option');

chrome.storage.local.get('isAutoTheater').then(({ isAutoTheater }) => {
  autoTheaterOpEle.checked = isAutoTheater;
});

const onChangeAutoTheater = (val) => {
  chrome.storage.local.set({ isAutoTheater: val.target.checked });
};

autoTheaterOpEle.addEventListener('change', onChangeAutoTheater);
