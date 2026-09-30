// Brambilla Quest — guscio Electron (Windows portatile)
const { app, BrowserWindow, shell, ipcMain, Menu } = require('electron');
const path = require('path');

const INDEX = path.join(__dirname, '..', '..', 'www', 'index.html');
let win = null;

if (!app.requestSingleInstanceLock()) { app.quit(); }
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.setAppUserModelId('it.brambillaangelo.quest');

function isExternal(url) { return /^(https?:|mailto:|tel:)/i.test(url); }

function create() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 1280, height: 760, minWidth: 820, minHeight: 480,
    backgroundColor: '#0A1B3F', title: 'Brambilla Quest', autoHideMenuBar: true, show: false,
    icon: path.join(__dirname, '..', '..', 'resources', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false, autoplayPolicy: 'no-user-gesture-required' },
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile(INDEX);
  win.webContents.setWindowOpenHandler(({ url }) => { if (isExternal(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (isExternal(url)) { e.preventDefault(); shell.openExternal(url); } });
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (input.type === 'keyDown' && input.key === 'Escape' && win.isFullScreen()) { win.setFullScreen(false); }
  });
  win.on('closed', () => { win = null; });
}

ipcMain.handle('bq:toggle-fullscreen', () => { if (win) win.setFullScreen(!win.isFullScreen()); });

app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
