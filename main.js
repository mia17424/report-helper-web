const { app, BrowserWindow, Tray, Menu, Notification, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

let mainWindow;
let tray;
const store = new Store();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  // 托盘功能
  tray = new Tray(path.join(__dirname, 'bg.jpg'));
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示', click: () => mainWindow.show() },
    { label: '退出', click: () => app.quit() }
  ]);
  tray.setToolTip('汇报助手');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.show());

  // 示例通知
  new Notification({ title: '汇报助手', body: '应用已启动！' }).show();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 监听渲染进程的本地存储请求
ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value);
});

ipcMain.handle('store-get', (event, key) => {
  return store.get(key);
});

// 监听通知请求
ipcMain.on('notify', (event, message) => {
  new Notification({ title: '汇报助手', body: message }).show();
}); 