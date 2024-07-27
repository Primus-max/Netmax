const { contextBridge, ipcRenderer } = require("electron");
const keytar = require("keytar");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  ipcRenderer: ipcRenderer,
});

document.addEventListener("DOMContentLoaded", async () => {
  // Создаем кастомную кнопку закрытия
  const closeButton = document.createElement("button");
  closeButton.innerText = "Закрыть";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.zIndex = "1000";
  closeButton.style.padding = "10px";
  closeButton.style.backgroundColor = "#ff5f57";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "5px";
  closeButton.style.color = "white";
  closeButton.style.cursor = "pointer";
  closeButton.id = "close-btn";
  // Добавляем кнопку в тело документа
  document.body.appendChild(closeButton);

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
  closeButton.addEventListener("click",  (event) => {
    console.log("RKBELKJL:SKJDF:LKSJD:LFKJ");
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
