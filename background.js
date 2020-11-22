var ws = 'wss://coderadio-admin.freecodecamp.org/api/live/nowplaying/coderadio';
var websocket;
var audio_element = document.createElement("audio");

function connect(host) {
    if (websocket === undefined) {
        websocket = new WebSocket(host);

        websocket.onopen = function () {
        };

        websocket.onmessage = function (event) {
            var msg = JSON.parse(event.data);
            chrome.storage.local.get('title', function (result) {
                if (result.title !== msg.now_playing.song.title) {
                    var options = {
                        type: "basic",
                        title: msg.now_playing.song.title,
                        message: msg.now_playing.song.artist,
                        iconUrl: 'images/32.png',
                        priority: 0,
                        silent: true
                    }
                    chrome.notifications.create(options);
                    chrome.storage.local.set({ 'artwork': msg.now_playing.song.art });
                    chrome.storage.local.set({ 'title': msg.now_playing.song.title });
                    chrome.storage.local.set({ 'artist': msg.now_playing.song.artist });
                    chrome.storage.local.set({ 'album': msg.now_playing.song.album });
                }
            });
            if (audio_element.src === '') {
                audio_element.src = msg.station.listen_url;
            }
            chrome.runtime.sendMessage({ "message": "radio_fetched", "data": msg.now_playing.song });
        };

        websocket.onclose = function () {
            websocket = undefined;
        };
    }
}

function closeWebSocketConnection() {
    if (websocket != null || websocket != undefined) {
        websocket.close();
        websocket = undefined;
    }
}

chrome.extension.onMessage.addListener(function (msg) {
    if (msg.action === 'load') {
        connect(ws);
    }
    if (msg.action === 'play') {
        if (audio_element.paused) {
            audio_element.play();
            closeWebSocketConnection();
        }
    }
    if (msg.action === 'pause') {
        if (audio_element.played) {
            audio_element.pause();
            closeWebSocketConnection();
        }
    }
});