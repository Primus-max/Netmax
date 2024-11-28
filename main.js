const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const setupAutoUpdater = require("./autoUpdater.js");
const setupTray = require("./tray.js");
const createWindow = require("./window.js");
const { screen } = require("electron");
const {
  setWindowWithBorder,
  setWindowWithoutBorder,
} = require("./assets/tamplates/border.js");

// Глобальная переменная для хранения ссылки на главное окно
let mainWindow;
let splash;

// Функция для создания главного окна
function initializeMainWindow() {
  try {
    const options = {
      resizable: false,
      maximizable: true,
      fullscreen: true,
    };

    mainWindow = createWindow(options);
    setupTray(mainWindow);
    setupAutoUpdater();
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
}

// Функция для обработки повторных запусков приложения
function handleSecondInstance() {
  // Если окно существует, просто активируем его
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
}

// Функция для обработки события "скрытия заставки"
ipcMain.on("hide-splash", () => {
  splash.destroy();
  mainWindow.show();
});

// Проверяем, является ли это первым экземпляром
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", handleSecondInstance);

  app.whenReady().then(initializeMainWindow);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      initializeMainWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  ipcMain.on("go-back", () => {
    if (mainWindow && mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack();
    }
  });

  ipcMain.on("window-hide", (event) => {
    if (!mainWindow) return;
    event.preventDefault();
    mainWindow.hide();
  });

  ipcMain.on("window-fullscreen", (event) => {
    if (mainWindow) {
      // // mainWindow.setKiosk(false);
      mainWindow.setAlwaysOnTop(false, "screen-saver");
      const { width, height } = screen.getPrimaryDisplay().size;

      mainWindow.setBounds({ x: 0, y: 0, width, height });

      mainWindow.setFullScreen(true);
      mainWindow.setResizable(false);
      mainWindow.setMaximizable(false);
      mainWindow.setAlwaysOnTop(false);

      setWindowWithoutBorder(mainWindow);
      mainWindow.reload();
    }
  });

  // 1
  ipcMain.on("open-borderless-draggable-window", (event) => {
    if (mainWindow) {
      setTimeout(() => {
        mainWindow.reload();
      }, 100);
      mainWindow.setFullScreen(false);
      mainWindow.setKiosk(false);
      mainWindow.setAlwaysOnTop(false);

      setTimeout(() => {
        mainWindow.setMovable(true);
        mainWindow.setResizable(false);
        mainWindow.setAlwaysOnTop(true, "screen-saver");

        const { width, height } = screen.getPrimaryDisplay().size;
        mainWindow.setBounds({
          x: -1,
          y: -1,
          width: width + 5,
          height: height + 5,
        });

        setWindowWithoutBorder(mainWindow);       
      }, 100);
    }
  });

  // 2
  ipcMain.on("open-bordered-draggable-window", (event) => {
    if (mainWindow) {
      mainWindow.reload();

      mainWindow.setFullScreen(false);
      mainWindow.setKiosk(false);
      mainWindow.setAlwaysOnTop(false);

      setTimeout(() => {
        mainWindow.setMovable(true);
        mainWindow.setResizable(false);
        mainWindow.setAlwaysOnTop(true, "screen-saver");

        const { width, height } = screen.getPrimaryDisplay().size;
        mainWindow.setBounds({
          x: -1,
          y: -1,
          width: width + 2,
          height: height + 2,
        });

        setWindowWithBorder(mainWindow);
      }, 100);
    }
  });

  // 3
  ipcMain.on("open-taskbar-draggable-window", (event) => {
    if (mainWindow) {
      mainWindow.reload();
      mainWindow.setFullScreen(false);
      mainWindow.setMovable(true);
      mainWindow.setResizable(false);
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      mainWindow.setBounds({
        x: 0,
        y: 0,
        width,
        height,
      });
      setWindowWithBorder(mainWindow);
    }
  });

  // 4
  ipcMain.on("open-taskbar-borderless-window", (event) => {
    if (mainWindow) {
      mainWindow.reload();
      mainWindow.setFullScreen(false);
      mainWindow.setMovable(true);
      mainWindow.setResizable(false);

      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      mainWindow.setBounds({
        x: -2,
        y: -2,
        width: width + 5,
        height: height + 5,
      });
    }
  });
}
