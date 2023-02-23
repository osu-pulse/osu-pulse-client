import * as path from 'path'
import { BrowserWindow, Tray, app, ipcMain, nativeTheme } from 'electron'

let window: BrowserWindow
let tray: Tray

const ROOT = app.isPackaged
  ? process.resourcesPath
  : path.resolve(__dirname, '..')

function createTray() {
  const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  tray = new Tray(
    path.resolve(ROOT, 'electron', 'assets', 'tray', `${theme}.ico`),
  )

  nativeTheme.on('updated', () => {
    const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    tray.setImage(
      path.resolve(ROOT, 'electron', 'assets', 'tray', `${theme}.ico`),
    )
  })

  tray.on('click', () => (window.isVisible() ? window.hide() : window.show()))

  window.on('minimize', () => window.hide())
  window.on('close', () => tray?.destroy())
}

async function createWindow() {
  window = new BrowserWindow({
    minWidth: 400,
    minHeight: 500,
    width: 1000,
    height: 800,
    icon: path.resolve(ROOT, 'electron', 'assets', 'app.ico'),
    frame: false,
    webPreferences: {
      preload: path.resolve(ROOT, 'electron', 'preload.js'),
    },
  })

  const indexUrl = 'http://127.0.0.1:4000'
  const indexPath = path.resolve(ROOT, 'dist', 'index.html')

  if (app.isPackaged)
    await window.loadFile(indexPath)
  else await window.loadURL(indexUrl)

  window.webContents.on('will-redirect', (event, url) => {
    if (url.includes('access_token')) {
      const tokens = new URL(url).search
      if (app.isPackaged)
        void window.loadFile(indexPath, { search: tokens })
      else void window.loadURL(`${indexUrl}${tokens}`)
    }
  })

  ipcMain.on('minimize', () => window.minimize())
  ipcMain.on('maximize', () => window.maximize())
  ipcMain.on('unMaximize', () => window.unmaximize())
  ipcMain.on('close', () => window.close())
}

void app.whenReady().then(async () => {
  await createWindow()
  createTray()

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
      app.quit()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      void createWindow()
  })
})
