import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { update } from './update'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main.js
// │ └─┬ preload.js
// └─┬ dist
//   └─┬ index.html

const isDev = process.env.NODE_ENV === 'development'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

const name = app.getName()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = isDev ? 'http://localhost:5173' : `file://${join(__dirname, '../dist/index.html')}`

async function createWindow() {
  win = new BrowserWindow({
    title: name,
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (isDev) {
    win.webContents.openDevTools()
  } else {
    win.webContents.on('did-finish-load', () => {
      win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Load the url of the app
  await win.loadURL(url)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (isDev) {
    childWindow.webContents.openDevTools({ mode: "detach" })
    childWindow.loadURL(`http://localhost:5173/#${arg}`)
  } else {
    childWindow.loadURL(`file://${join(__dirname, '../dist/index.html')}#${arg}`)
  }
}) 