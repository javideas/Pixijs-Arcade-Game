const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    onAltF11Pressed: (callback) => ipcRenderer.on('altf11-pressed', callback)
});