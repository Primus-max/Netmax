const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  ipcRenderer: ipcRenderer,
});

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("input_wp_protect_password");
  if (passwordInput)
    passwordInput.value = "HTY5GTfdJDRUT4#YH#UJDHerdS7$JsW2Fh@h";
  const submitButton = document.querySelector('input[type="submit"]');
  if (submitButton) submitButton.click();

  // Обработка нажатия правой кнопки мыши
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    window.api.send('go-back');
  });
});
