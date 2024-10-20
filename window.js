const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
} = require("electron");
const path = require("path");

let mainWindow = null;
let splash = null;

// Параметры по умолчанию
const defaultWindowOptions = {
  fullscreen: true,
  resizable: false,
  maximizable: false,
};

function createWindow(options = {}) {
  const preloadPath = path.resolve(__dirname, "preload.js");
  
  // Объединяем переданные параметры с параметрами по умолчанию
  const windowOptions = {
    ...defaultWindowOptions,
    ...options,
  };

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
    resizable: windowOptions.resizable,
    maximizable: windowOptions.maximizable,
    fullscreen: windowOptions.fullscreen,
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

  mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(null);  
  mainWindow.loadURL("https://netmax.network");
  
  mainWindow.webContents.on("did-finish-load", () => {    
    setTimeout(() => {
      splash.destroy();
      mainWindow.show();      
    }, 2000);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {    
    return { action: 'deny' }; // Предотвращаем открытие нового окна
  });

  ipcMain.on("close-window", (event) => {
    event.preventDefault();
    mainWindow.hide();    
  });

  return mainWindow;
}

module.exports = createWindow;
