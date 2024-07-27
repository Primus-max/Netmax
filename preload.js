const { contextBridge, ipcRenderer } = require("electron");
const keytar = require("keytar");
const createCloseButton = require("./assets/tamplates/closeButton.js");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  ipcRenderer: ipcRenderer,
});

document.addEventListener("DOMContentLoaded", async () => {
  const closeButton = createCloseButton();

  const passwordInput = document.getElementById("input_wp_protect_password");
  if (passwordInput) {
    const pass = await keytar.getPassword("netmax", "password");
    passwordInput.value = pass;
  }
  const submitButton = document.querySelector('input[type="submit"]');
  if (submitButton) {
    submitButton.click();
  }

  // Добавляем обработчик события для кнопки закрытия
  closeButton.addEventListener("click", () => {    
    ipcRenderer.send("window-hide");
  });

  // Отправка события основному процессу для скрытия заставки
  //ipcRenderer.send("hide-splash");

  // Обработка нажатия правой кнопки мыши
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    ipcRenderer.send("go-back");
  });
});
