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
    if(document.location.href === 'https://netmax.network/menu/' || 
      document.location.href === 'https://netmax.network/homepage/')
      return;

    event.preventDefault();
    ipcRenderer.send("go-back");    
  });

  // applyVideoStyles();

  // // Прилепить видео к верху экрана
  // observer.observe(document.body, { childList: true, subtree: true });
});

// Метод для блокировки скролла
function blockScroll(event) {
  event.preventDefault();
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// Метод для активации блокировки скролла
function enableScrollBlock() {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollBarWidth}px`;

  document.addEventListener('scroll', blockScroll, { passive: false });
  document.addEventListener('wheel', blockScroll, { passive: false });
  document.addEventListener('keydown', handleKeydown, { passive: false });
  console.log('Scroll block enabled');
}

// Метод для деактивации блокировки скролла
function disableScrollBlock() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

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
  if (currentUrl === 'https://netmax.network/media/' 
    || currentUrl === 'https://netmax.network/homepage/') {
    enableScrollBlock();
  } else {
    disableScrollBlock();
  }
}

document.addEventListener('mousedown', function(event) {
  if (event.button === 1) { // Нажата средняя кнопка мыши
      let target = event.target;
      if (target.tagName === 'A') { // Если это ссылка
          event.preventDefault(); // Блокируем открытие ссылки          
      }
  }
}, true);






// Стили для окна с видео, чтобы прилепить к верху
// function applyVideoStyles() {
//   const videoElement = document.querySelector('video.wp-video-shortcode');
  
//   if (videoElement) {
//     videoElement.style.position = 'fixed';
//     videoElement.style.top = '50px';
//     videoElement.style.left = '50%';
//     videoElement.style.transform = 'translateX(-50%)';
//     videoElement.style.zIndex = '1000';
//     videoElement.style.width = 'auto';
//     videoElement.style.height = 'auto';
//     console.log('Video styles applied');
//   }
// }

// Объект MutationObserver для отслеживания изменений в DOM, чтобы прилепить видео к верху
// const observer = new MutationObserver((mutationsList) => {
//   for (const mutation of mutationsList) {
//     if (mutation.type === 'childList') {
//       applyVideoStyles(); 
//     }
//   }
// });