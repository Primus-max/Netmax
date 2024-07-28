const { app, BrowserWindow, Menu, nativeImage, Tray } = require('electron');
const path = require('path');

let tray = null;

function setupTray(mainWindow) {
  if (!mainWindow || !(mainWindow instanceof BrowserWindow)) {
    console.error("Invalid mainWindow object provided to setupTray");
    return;
  }

  // Используем абсолютный путь для иконки
  const iconPath = path.join(__dirname, './assets/images/icon16.png');
  tray = new Tray(nativeImage.createFromPath(iconPath));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Закрыть",
      click: () => {
        app.isQuiting = true;
        mainWindow.destroy();
        app.quit();
      },
    },
  ]);
  

  tray.setToolTip("Netmax");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

module.exports = setupTray;
