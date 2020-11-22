window.onload = function (e) {
  chrome.storage.local.get('artwork', function (result) {
    if (result.artwork !== undefined)
      document.getElementById('artwork').src = result.artwork;
  });
  chrome.storage.local.get('title', function (result) {
    if (result.title !== undefined)
      document.getElementById('title').innerHTML = result.title;
  });
  chrome.storage.local.get('artist', function (result) {
    if (result.artist !== undefined)
      document.getElementById('artist').innerHTML = result.artist;
  });
  chrome.storage.local.get('album', function (result) {
    if (result.album !== undefined)
      document.getElementById('album').innerHTML = result.album;
  });

  chrome.extension.sendMessage({ action: 'load' });

  document.getElementById("play").addEventListener("click", function () {
    e.preventDefault();
    document.getElementById("play").classList.toggle('paused');
    chrome.extension.sendMessage({ action: 'play' });
  });

  document.getElementById('volume').addEventListener("change", function(){
    chrome.extension.sendMessage({ action: 'volume', data: this.value });
  });
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "radio_fetched") {
      document.getElementById('artwork').src = request.data.art;
      document.getElementById('title').innerHTML = request.data.title;
      document.getElementById('artist').innerHTML = request.data.artist;
      document.getElementById('album').innerHTML = request.data.album;
    }
    if (request.message === 'player') {
      if (request.data.status === false) {
        document.getElementById("play").classList.add('paused');
      }
      document.getElementById("volume").value = (request.data.volume * 100);
    }
  }
);