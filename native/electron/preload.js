const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('bqNative', {
  platform: process.platform,
  toggleFullscreen: () => ipcRenderer.invoke('bq:toggle-fullscreen'),
});
