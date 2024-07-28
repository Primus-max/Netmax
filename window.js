const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  Menu,
  webFrame,
} = require("electron");
const path = require("path");

// Отменяет масштабирование приложения
app.commandLine.appendSwitch('force-device-scale-factor', '1');
app.commandLine.appendSwitch('high-dpi-support', '1');

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
    maximizable: false,
    closable: true,
    hiddenInMissionControl: true,
    backgroundColor: "#00000000",
    icon: path.join(__dirname, "./assets/images/Icon46.png"),
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

  //mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(null);  
  mainWindow.loadURL("https://netmax.network");

  mainWindow.webContents.on("did-finish-load", () => {    
    setTimeout(() => {
      splash.destroy();
      mainWindow.show();
    }, 2000);
  });
 
  ipcMain.on("close-window", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  return mainWindow;
}

module.exports = createWindow;
