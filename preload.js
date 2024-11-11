const { contextBridge, ipcRenderer } = require("electron");
//const keytar = require("keytar");
//const { webFrame } = require("electron");
const createCloseButton = require("./assets/tamplates/closeButton.js");
const {
  createMinimizeButton,
  createMaximizeButton,
} = require("./assets/tamplates/resizebleButton.js");
const {
  authorize,
  trackLoginForm,
  autoLogin,
} = require("./utils/authorize.js");
const { handleMouseMoveUpdate } = require("./utils/windowUtils.js");
const { saveLoginData } = require("./store/localStorageStore.js");
const { createLoginDropdown } = require("./utils/htmlGeneratorUtils.js");
const { createHeader } = require("./assets/tamplates/header.js");

const fs = require("fs");
const path = require("path");

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
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(1000);

  // Авторизация
  authorize();

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
  }, 300);

  checkAndToggleScrollBlock(); // Проверка и применение блокировки скролла

  trackLoginForm(); // Сохранение авторизационных данных
  loadWinStatesModal(); // Встраиваем модальное окно для выбора размера окна

  const closeButton = createCloseButton();
  const minimizeBtn = createMinimizeButton();
  const maximizeBtn = createMaximizeButton();
  const header = createHeader();

  // Добавляем обработчик события для кнопки закрытия
  closeButton.addEventListener("click", () => {
    ipcRenderer.send("window-hide");
  });

  // Добавляем обработчик события для кнопки изменения размера окна
  minimizeBtn.addEventListener("click", () => {
    document.getElementById("WinStateModal").style.display = "flex";
  });

  maximizeBtn.addEventListener("click", () => {
    ipcRenderer.send("window-resize");
  });

  header.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  // Блокировка скролла по нажатию колёсика мыши
  document.addEventListener(
    "mousedown",
    function (event) {
      // Проверяем, что это средний клик мыши
      if (event.button === 1) {
        let target = event.target;

        // Ищем родительский элемент ссылки
        while (target && target.tagName !== "A") {
          target = target.parentElement;
        }

        if (target && target.tagName === "A") {
          ipcRenderer.send("middle-btn-blocked");
          return false;
        }
      }
    },
    true
  );

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

function loadWinStatesModal() {
  // Читаем HTML содержимое модального окна
  const modalHtml = fs.readFileSync(
    path.join(__dirname, "assets/tamplates/modals/winStateModal/modal.html"),
    "utf8"
  );

  // Шрифты
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
  document.head.appendChild(fontLink);

  // Создаем и добавляем CSS для модального окна
  const modalStyle = document.createElement("link");
  modalStyle.rel = "stylesheet";
  modalStyle.href = `file://${path.join(
    __dirname,
    "assets/tamplates/modals/winStateModal/style.css"
  )}`;
  document.head.appendChild(modalStyle);

  // Вставляем HTML модального окна в конец <body>
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Добавляем обработчик для закрытия модального окна
  document.querySelector(".close-btn").addEventListener("click", closeModalWinSet);

  // Массив с путями к изображениям
  const imageData = [
    "win_01.png",
    "win_02.png",
    "win_03.png",
    "win_04.png",
    "win_05.png",
  ];

  // Получаем все элементы с классом 'image', которые являются <img>
  const imageElements = document.querySelectorAll(".image");

  // Динамически заменяем изображения в каждом элементе
  imageElements.forEach((imageElement, index) => {
    if (imageData[index]) {
      // Обновляем атрибуты src и alt для каждого изображения
      imageElement.src = `file://${path.join(
        __dirname,
        "./assets/images/",
        imageData[index]
      )}`;
      imageElement.alt = `Image ${index + 1}`;
    }
  });


  // Добавляем обработчик для каждого изображения
  imageElements.forEach((img, index) => {
    img.addEventListener("click", () => {
      openWindowAction(index + 1);
    });
  });
}


// Функция для обработки клика на каждом изображении
function openWindowAction(imageNumber) {
  switch (imageNumber) {
      case 1:
          openBorderlessDraggableWindow();
          break;
      case 2:
          openBorderedDraggableWindow();
          break;
      case 3:
          openTaskbarDraggableWindow();
          break;
      case 4:
          openTaskbarBorderlessWindow();
          break;
      case 5:
          openFullscreenWindow();
          break;
      default:
          console.log("Нет действия для этого изображения");
  }
}

// Пример отдельных методов для разных окон
function openBorderlessDraggableWindow() {
  console.log("Открывается безрамочное окно с перетаскиванием за хедер");
  ipcRenderer.send("open-borderless-draggable-window");
  // Логика для открытия окна
}

function openBorderedDraggableWindow() {
  console.log("Открывается окно с рамкой и перетаскиванием за хедер");
  // Логика для открытия окна
}

function openTaskbarDraggableWindow() {
  console.log("Открывается окно с рамкой, панелью задач и перетаскиванием за хедер");
  // Логика для открытия окна
}

async function openTaskbarBorderlessWindow() {
  await closeModalWinSet(); // Ждем завершения закрытия модального окна

  // После завершения закрытия выполняем отправку события
  setTimeout(() => {
    ipcRenderer.send("open-taskbar-borderless-window");
    console.log("Открывается безрамочное окно с панелью задач и перетаскиванием за хедер");
  }, 200);
}

function openFullscreenWindow() {
  console.log("Открывается стандартное полноэкранное окно без перетаскивания");
  // Логика для открытия окна
}

function closeModalWinSet() {
  return new Promise((resolve) => {
    const modal = document.getElementById("WinStateModal");

    // Добавляем класс для плавного исчезновения
    modal.classList.add("fade-out");

    // Ждем окончания перехода и скрываем элемент
    modal.addEventListener("transitionend", () => {
      modal.style.display = "none";
      modal.classList.remove("fade-out"); // Убираем класс для следующего открытия
      resolve(); // Завершаем Promise после закрытия
    }, { once: true });
  });
}

