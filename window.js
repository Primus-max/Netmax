const { BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
  // Формируем абсолютный путь к preload.js
  const preloadPath = path.resolve(__dirname, 'preload.js');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    movable: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    title: "My App",
    webPreferences: {
      nodeIntegration: false, 
      contextIsolation: true, 
      preload: preloadPath,
    },
  });

  mainWindow.on("close", (event) => {
    // Предотвращаем закрытие окна
    event.preventDefault();
    mainWindow.hide(); // Прячем окно
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
  });

  mainWindow.loadURL("https://netmax.network");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on("new-window", (event, newUrl) => {
    event.preventDefault();
    mainWindow.loadURL(newUrl);
  });

  mainWindow.webContents.on("context-menu", () => {
    mainWindow.webContents.goBack();
  });

  mainWindow.webContents.setVisualZoomLevelLimits(1, 1);

  return mainWindow;
}

module.exports = createWindow;
