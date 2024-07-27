const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const setupAutoUpdater = require("./autoUpdater.js");
const setupTray = require("./tray.js");
const createWindow = require("./window.js");

// Глобальная переменная для хранения ссылки на главное окно
let mainWindow;
let splash;

// Функция для создания главного окна
function initializeMainWindow() {
  try {
    mainWindow = createWindow();
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
}
