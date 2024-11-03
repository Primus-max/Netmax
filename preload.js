const { contextBridge, ipcRenderer } = require("electron");
//const keytar = require("keytar");
//const { webFrame } = require("electron");
const createCloseButton = require("./assets/tamplates/closeButton.js");
const createResizableButton = require("./assets/tamplates/resizebleButton.js");
const {
  authorize,
  trackLoginForm,
  autoLogin,
} = require("./utils/authorize.js");
const { handleMouseMoveUpdate } = require("./utils/windowUtils.js");
const {saveLoginData } = require("./store/localStorageStore.js");
const {createLoginDropdown} = require('./utils/htmlGeneratorUtils.js');

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  ipcRenderer: ipcRenderer,
  getLogoutStatus: async () => {
   return await ipcRenderer.invoke("get-logout-status");
  },
  resetLogoutStatus: async () => {
    await ipcRenderer.invoke("reset-logout-status");
  },
});

document.addEventListener("DOMContentLoaded", async () => {
 // Кнопка войти
 const enterButton = document.getElementById("slider-1-slide-1-layer-20");
 enterButton?.click();

  // Cлушатель на изменение URL
  document.addEventListener("popstate", checkAndToggleScrollBlock);
  
  const emailInput = document.getElementById("pxp-signin-modal-email");
  const passwordInput = document.getElementById("pxp-signin-modal-password");

  // Проверяем, что поля существуют
  if (emailInput && passwordInput) 
      createLoginDropdown(emailInput, passwordInput);
    
  setTimeout(() => {
    const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

    if (!isLoggedOut) {
      autoLogin();
      localStorage.setItem("isLoggedOut", "false");    
    }
  }, 300) 

  checkAndToggleScrollBlock();

  // Сохранение авторизационных данных
  trackLoginForm();

  const closeButton = createCloseButton();
  const resizableButton = createResizableButton();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(1000);

  // Авторизация
  authorize();

  // Добавляем обработчик события для кнопки закрытия
  closeButton.addEventListener("click", () => {
    ipcRenderer.send("window-hide");
  });

  // Добавляем обработчик события для кнопки изменения размера окна
  resizableButton.addEventListener("click", () => {
    ipcRenderer.send("window-resize");
  });

  // Обработка нажатия правой кнопки мыши
  document.addEventListener("contextmenu", (event) => {
    if (
      document.location.href === "https://netmax.network/menu/" ||
      document.location.href === "https://netmax.network/homepage/"
    )
      return;

    event.preventDefault();
    ipcRenderer.send("go-back");
  });

  // Обновления страницы по боковой клавише
  handleMouseMoveUpdate();
});

// TODO вынести все методы в утилиты
// Метод для блокировки скролла
function blockScroll(event) {
  event.preventDefault();
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// Метод для активации блокировки скролла
function enableScrollBlock() {
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollBarWidth}px`;

  document.addEventListener("scroll", blockScroll, { passive: false });
  document.addEventListener("wheel", blockScroll, { passive: false });
  document.addEventListener("keydown", handleKeydown, { passive: false });
  console.log("Scroll block enabled");
}

// Метод для деактивации блокировки скролла
function disableScrollBlock() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";

  document.removeEventListener("scroll", blockScroll);
  document.removeEventListener("wheel", blockScroll);
  document.removeEventListener("keydown", handleKeydown);
  console.log("Scroll block disabled");
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
  if (
    currentUrl === "https://netmax.network/media/" ||
    currentUrl === "https://netmax.network/homepage/" ||
    currentUrl === "https://netmax.network/messenger/sample-page/"
  ) {
    enableScrollBlock();
  } else {
    disableScrollBlock();
  }
}

document.addEventListener(
  "mousedown",
  function (event) {
    if (event.button === 1) {
      // Нажата средняя кнопка мыши
      let target = event.target;
      if (target.tagName === "A") {
        // Если это ссылка
        event.preventDefault(); // Блокируем открытие ссылки
      }
    }
  },
  true
);

function signOut() {
  alert("try to sign out");
  const currentUrl = document.location.href;
  if (currentUrl.includes("action=logout")) alert("Sign out");
}
