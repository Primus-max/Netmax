const { app, BrowserWindow } = require('electron');
const setupAutoUpdater = require('./autoUpdater.js');
const setupTray = require('./tray.js');
const createWindow = require('./window.js');

let mainWindow;
app.whenReady().then(() => {
  try {
    mainWindow = createWindow();       
    setupTray(mainWindow);    
    setupAutoUpdater();    
  } catch (error) {
    console.error('Error during app initialization:', error);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow().then((window) => {
        mainWindow = window;       
      }).catch((error) => {
        console.error('Error during window creation:', error);
      });
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
