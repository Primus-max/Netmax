const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

function setupAutoUpdater() {
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available:', info);
  });

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err);
  });

  autoUpdater.on('download-progress', (progress) => {    
    log.info('Download progress:', progress);
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info);
    autoUpdater.quitAndInstall();
  });

  // Start the update check process
  autoUpdater.checkForUpdatesAndNotify();
}

module.exports = setupAutoUpdater;
