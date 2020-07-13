const { ipcRenderer, remote } = require('electron');

function closeWindow() {
    remote.getCurrentWindow().close();
}