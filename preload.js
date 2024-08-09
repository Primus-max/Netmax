const { contextBridge, ipcRenderer } = require("electron");
const keytar = require("keytar");
const { webFrame } = require("electron");
const createCloseButton = require("./assets/tamplates/closeButton.js");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  ipcRenderer: ipcRenderer,
});


document.addEventListener("DOMContentLoaded", async () => {

  depricateScroll();

  const closeButton = createCloseButton();

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(1000);

  // Авторизация
  const protectionForm = document.querySelector(".ppw-swp-form");
  if (protectionForm) {
    console.log('Protection form found');

    const passwordInput = protectionForm.querySelector("#input_wp_protect_password");
    if (passwordInput) {
      console.log('Password input found');
      const pass = await keytar.getPassword("netmax", "password");
      passwordInput.value = pass;
      console.log('Password filled in');
    } else {
      console.log('Password input not found');
    }

    const submitButton = protectionForm.querySelector('input.button.button-primary.button-login');
    if (submitButton) {
      console.log('Submit button found');
      submitButton.click();
    } else {
      console.log('Submit button not found');
    }
  } else {
    console.log('Protection form not found');
  }

  // Добавляем обработчик события для кнопки закрытия
  closeButton.addEventListener("click", () => {
    ipcRenderer.send("window-hide");
  });

  // Обработка нажатия правой кнопки мыши
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    ipcRenderer.send("go-back");
  });
});

function depricateScroll(){
  const currentUrl = window.location.href; 
  if (currentUrl === 'https://netmax.network/media/') {
    document.body.style.overflow = 'hidden'; 
    document.body.style.height = '100vh';
  } else {
    document.body.style.overflow = ''; 
  }
}