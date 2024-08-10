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

console.log('Current page', document.location.href);

  checkAndToggleScrollBlock();

  // Добавляем слушатель на изменение URL (например, через popstate)
  document.addEventListener('popstate', checkAndToggleScrollBlock);

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
    if(document.location.href === 'https://netmax.network/menu/')
      return;

    event.preventDefault();
    ipcRenderer.send("go-back");    
  });
});

// Метод для блокировки скролла
function blockScroll(event) {
  event.preventDefault();
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// Метод для активации блокировки скролла
function enableScrollBlock() {
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100vh';
  document.addEventListener('scroll', blockScroll, { passive: false });
  document.addEventListener('wheel', blockScroll, { passive: false });
  document.addEventListener('keydown', handleKeydown, { passive: false });
}

// Метод для деактивации блокировки скролла
function disableScrollBlock() {
  document.body.style.overflow = '';
  document.body.style.height = '';
  document.removeEventListener('scroll', blockScroll);
  document.removeEventListener('wheel', blockScroll);
  document.removeEventListener('keydown', handleKeydown);
  console.log('Scroll block disabled');
}

// Метод для обработки нажатий клавиш, вызывающих прокрутку
function handleKeydown(event) {
  const keysToBlock = [32, 33, 34, 35, 36, 38, 40]; // Пробел, PageUp, PageDown, Home, End, Стрелки
  if (keysToBlock.includes(event.keyCode)) {
    blockScroll(event);
  }
}

// Метод для проверки текущего URL и применения блокировки скролла
function checkAndToggleScrollBlock() {
  const currentUrl = document.location.href;
  if (currentUrl === 'https://netmax.network/media/') {
    enableScrollBlock();
  } else {
    disableScrollBlock();
  }
}