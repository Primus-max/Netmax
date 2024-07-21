// import { contextBridge, ipcRenderer } from 'electron';

// contextBridge.exposeInMainWorld('api', {
//   minimize: () => ipcRenderer.send('window-control', 'minimize'),
//   close: () => ipcRenderer.send('window-control', 'close')
// });
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {  
  close: () => ipcRenderer.send('window-control', 'close')
});
