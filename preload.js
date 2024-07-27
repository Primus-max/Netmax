const { contextBridge, ipcRenderer } = require("electron");
const keytar = require('keytar');

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  ipcRenderer: ipcRenderer,
});

document.addEventListener("DOMContentLoaded", async () => {
  const passwordInput = document.getElementById("input_wp_protect_password");
  if (passwordInput) {
    const pass = await keytar.getPassword("netmax", "password");
    passwordInput.value = pass;
  }
  const submitButton = document.querySelector('input[type="submit"]');
  if (submitButton) {
    submitButton.click();
  }

  // Отправка события основному процессу для скрытия заставки
  window.api.send('hide-splash');

  // Обработка нажатия правой кнопки мыши
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    window.api.send('go-back');
  });
});

