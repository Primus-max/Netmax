const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
  
  const preloadPath = path.resolve(__dirname, 'preload.js');
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, 
    fullscreenable: true,
    fullscreen: true,
    resizable: false, 
    maximizable: false, 
    movable: false, 
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false, 
      preload: preloadPath,
    },
  });

  mainWindow.loadFile('index.html'); // Загружаем локальный файл HTML

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
  
  ipcMain.on('window-close', () => {
    if (mainWindow) {
      mainWindow.hide();
    }
  });

  return mainWindow;
}

app.on('ready', () => {
  mainWindow = createWindow();
  mainWindow.center(); // Центрируем окно на экране
});

