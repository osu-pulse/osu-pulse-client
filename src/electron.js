const path = require('path');
const { app, BrowserWindow, Menu, Tray } = require('electron');

const indexPage = '../dist/web/index.html';
const electronIcon = path.resolve(__dirname, 'core', 'assets', 'electron.ico');

let window;
let tray;

function createTray() {
  tray = new Tray(electronIcon);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Show', click: () => window.show() },
      { label: 'Quit', click: () => app.quit() },
    ]),
  );

  tray.on('click', () => {
    window.show();
    tray.destroy();
  });
}

function setupTray() {
  window.on('minimize', (event) => {
    event.preventDefault();
    window.hide();
    createTray();
  });

  window.on('close', () => tray?.destroy());
}

function createWindow() {
  window = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: electronIcon,
    autoHideMenuBar: true,
  });
}

async function setupWindow() {
  createWindow();

  await window.loadFile(indexPage);
  window.webContents.on('will-redirect', async (event, url) => {
    if (url.includes('access_token')) {
      await window.loadFile(indexPage, { search: new URL(url).search });
    }
  });

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
}

async function setupApp() {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  await setupWindow();
  setupTray();
}

app.whenReady().then(setupApp);
