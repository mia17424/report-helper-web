const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 示例：通知主进程显示通知
  notify: (message) => ipcRenderer.send('notify', message),
  // 预留：本地存储等功能
  storeSet: (key, value) => ipcRenderer.invoke('store-set', key, value),
  storeGet: (key) => ipcRenderer.invoke('store-get', key),
}); 