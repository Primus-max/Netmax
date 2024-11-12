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
        mainWindow.setKiosk(false);                    // Отключаем режим киоска для сброса состояния       
        const { width, height } = screen.getPrimaryDisplay().size;

        // Сбрасываем отступы и возвращаем окно на полный экран
        mainWindow.setBounds({ x: 0, y: 0, width, height });

        mainWindow.setFullScreen(true);                // Принудительно включаем полноэкранный режим
        mainWindow.setResizable(false);                // Снова отключаем изменение размеров
        mainWindow.setMaximizable(false);              // Отключаем возможность максимизации
        mainWindow.setAlwaysOnTop(false);              // Отключаем режим "всегда поверх" на случай, если он был установлен

        setWindowWithoutBorder(mainWindow);            // Применяем стиль без рамки
        console.log("Переключено в полноценный полноэкранный режим.");
    }
});

  // 1
  ipcMain.on("open-borderless-draggable-window", (event) => {
    if (mainWindow) {
      mainWindow.setFullScreen(false);
      mainWindow.setFullScreenable(false);
      mainWindow.setResizable(false);
      mainWindow.setMovable(true);
      mainWindow.setMaximizable(false);
     mainWindow.setAlwaysOnTop(true, "screen-saver");
     const { width, height } = screen.getPrimaryDisplay().workAreaSize;
     mainWindow.setBounds({
       x: 0,
       y: 0,
       width,
       height,
     });
      setWindowWithoutBorder(mainWindow);
    }
  });

  // 2
  ipcMain.on("open-bordered-draggable-window", (event) => {
    if (mainWindow) {
      mainWindow.setFullScreen(false);
      mainWindow.setFullScreenable(false);
      mainWindow.setResizable(false);
      mainWindow.setMovable(true);
      mainWindow.setMaximizable(false);
      //mainWindow.setAlwaysOnTop(true, "screen-saver");
      const { width, height } = screen.getPrimaryDisplay().size;

      mainWindow.setBounds({
        x: 0,
        y: 0,
        width: width - 1,
        height: height - 1,
      });

      setWindowWithBorder(mainWindow);
    }
  });

  // 3
  ipcMain.on("open-taskbar-draggable-window", (event) => {
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
      setWindowWithBorder(mainWindow);
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
