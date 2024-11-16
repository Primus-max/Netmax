const { app, BrowserWindow, ipcMain, Menu, screen } = require("electron");
const path = require("path");

let mainWindow = null;
let splash = null;
let isLoggedOut = false;
let isMiddleBtnBlocked = false;

app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

// Параметры по умолчанию
const defaultWindowOptions = {
  fullscreen: true,
  resizable: false,
  maximizable: false,
};

function createWindow(options = {}) {
  if (isMiddleBtnBlocked) {
    console.log("Middle button blocked, window will not be created.");
    isMiddleBtnBlocked = false;
    return null;
  }

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
    setAlwaysOnTop: true,
    icon: path.join(__dirname, "./assets/images/Icon46.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: preloadPath,
      enableRemoteModule: true,
      webSecurity: false,
      zoomFactor: 1,
      disableBlinkFeatures: "Autofill",
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
    const currentUrl = mainWindow.webContents.getURL();
    if (currentUrl === "https://netmax.network/menu/") {
      splash.destroy();
      mainWindow.show();

      mainWindow.webContents.executeJavaScript(`
        const metaTag = document.createElement('meta');
        metaTag.name = 'viewport';
        metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
        document.head.appendChild(metaTag);
      `);
    }  
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const isExternalLink = /^https?:\/\//.test(url);

    if (isExternalLink) {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;

      // Возвращаем разрешение на открытие окна с нужными параметрами
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          frame: true,
          resizable: false,
          maximizable: true,
          width,
          height,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
          },
        },
      };
    }

    // Если не разрешено, возвращаем deny
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", async (event, url) => {
    if (isMiddleBtnBlocked) event.preventDefault();
    if (url.includes("action=logout")) {
      mainWindow.webContents.executeJavaScript(
        "localStorage.setItem('isLoggedOut', 'true');"
      );
    }
  });

  let eventTimeout;

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isMiddleBtnBlocked) {
      return { action: "deny" };
    }

    if (url.includes("specific-condition")) {
      return { action: "deny" };
    }

    return { action: "allow" };
  });

  ipcMain.on("middle-btn-blocked", (event) => {
    if (isMiddleBtnBlocked) {
      return;
    }

    isMiddleBtnBlocked = true;
    console.log("Middle button blocked:", isMiddleBtnBlocked);

    clearTimeout(eventTimeout);
    eventTimeout = setTimeout(() => {
      isMiddleBtnBlocked = false;
      console.log("Middle button unblocked:", isMiddleBtnBlocked);
    }, 1000);
  });

  ipcMain.on("close-window", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  return mainWindow;
}

module.exports = createWindow;
