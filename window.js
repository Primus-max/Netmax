const { app, BrowserWindow, ipcMain, screen, Menu } = require("electron");
const path = require("path");

let mainWindow = null;
let splash = null;

function createWindow() {
  const preloadPath = path.resolve(__dirname, "preload.js");

  // Получаем размеры экрана
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  splash = new BrowserWindow({
    width: 400,
    height: 300,
    fullscreenable: true,
    fullscreen: true,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      preload: preloadPath,
    },
  });

  splash.loadFile('splash.html');

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    frame: true,
    fullscreenable: true,
    resizable: false,
    maximizable: true,
    movable: false,
    closable: true,
    icon: path.join(__dirname, "./assets/Icon46.png"),
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: preloadPath,
      enableRemoteModule: true,
    },
  });

  mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(null);
  mainWindow.loadURL("https://netmax.network");

  mainWindow.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      splash.destroy();
      mainWindow.show();
    }, 2000);
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.setBounds({
      x: screen.getPrimaryDisplay().bounds.x,
      y: screen.getPrimaryDisplay().bounds.y,
      width: screen.getPrimaryDisplay().bounds.width,
      height: screen.getPrimaryDisplay().bounds.height,
    });
  });

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  ipcMain.on("window-hide", (event) => {
    if (mainWindow) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  return mainWindow;
}

module.exports = createWindow;
