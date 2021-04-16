import { join } from 'path'
import { app, BrowserWindow } from 'electron'
import is_dev from 'electron-is-dev'
import dotenv from 'dotenv'

dotenv.config({ path: join(__dirname, '../../.env') })

let win = null

class createWin {
  constructor () {
    console.log("main thread window creation")
    win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    })

    const URL = is_dev
      ? `http://localhost:${process.env.PORT}`
      : `file://${join(__dirname, '../../dist/render/index.html')}`

    win.loadURL(URL)
  }
}

app.whenReady().then(() => new createWin())

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new createWin()
  }
})
