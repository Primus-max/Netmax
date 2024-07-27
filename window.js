const { app, BrowserWindow, ipcMain, screen, Menu } = require("electron");
const path = require("path");

let mainWindow = null;
let splash = null;

function createWindow() {
  const preloadPath = path.resolve(__dirname, "preload.js");
  splash = new BrowserWindow({
    fullscreenable: true,
    fullscreen: true,
    resizable: false,
    maximizable: true,
    movable: false,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      preload: preloadPath,
    },
  });

  splash.loadFile("splash.html");

  mainWindow = new BrowserWindow({
    frame: false,
    fullscreen: true,
    resizable: false,
    maximizable: true,
    closable: true,
    hiddenInMissionControl: true,
    icon: path.join(__dirname, "./assets/Icon46.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: preloadPath,
      enableRemoteModule: true,
      webSecurity: false,
    },
    webContents: {
      backgroundThrottling: false,
      enableRemoteModule: true,
    },
  });

  // mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(null);
  //mainWindow.loadURL("https://google.com");
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

  ipcMain.on("close-window", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  return mainWindow;
}

module.exports = createWindow;
