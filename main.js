const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const setupAutoUpdater = require("./autoUpdater.js");
const setupTray = require("./tray.js");
const createWindow = require("./window.js");
const { screen } = require("electron");

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

  ipcMain.on("window-resize", (event) => {
    if (!mainWindow) return;

    if (!mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(true);
      mainWindow.setResizable(false);
      mainWindow.setMaximizable(false);
      console.log(
        "Switched to fullscreen mode:",
        mainWindow.webContents.getURL()
      );
    }
  });

  // 1.
  ipcMain.on("open-borderless-draggable-window", (event) => {
    if (mainWindow) {
      mainWindow.setFullScreen(false); // Отключаем полноэкранный режим
      mainWindow.setMovable(true); // Включаем возможность перетаскивания
      mainWindow.setResizable(false); // Отключаем изменение размеров

      // Получаем размер рабочего пространства (не включая панели задач)
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;

      // Устанавливаем окно на весь экран
      mainWindow.setBounds({
        x: 0,
        y: 0,
        width,
        height,
      });

      console.log("Окно стало перетаскиваемым и занимает весь экран.");
    }
  });

  // 4
  ipcMain.on("open-taskbar-borderless-window", (event) => {
    if (mainWindow) {
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
    }
  });

  // let isResized = false;
  // let lastUrl = "";

  // ipcMain.on("window-resize", (event) => {
  //   if (!mainWindow) return;

  //   if (!isResized) {
  //     mainWindow.setResizable(false);
  //     mainWindow.setMaximizable(true);
  //     mainWindow.setFullScreen(false);
  //     lastUrl = mainWindow.webContents.getURL();
  //   } else {
  //     mainWindow.setFullScreen(true);
  //     mainWindow.setResizable(false);
  //     mainWindow.setMaximizable(false);
  //     console.log("Switched to fullscreen mode:", lastUrl);
  //   }

  //   isResized = !isResized;
  // });
}
