
const path = require("path");
const { app } = require('electron');
function createCloseButton() {
    const closeButton = document.createElement("button");
    closeButton.id = "close-btn";
    
    // Стиль кнопки
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.zIndex = "1000";
    closeButton.style.padding = "0";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.width = "20px";
    closeButton.style.height = "20px";
    closeButton.style.cursor = "pointer";
    
    const imagePath = path.resolve('close.png');
    const imageUrl = `${imagePath}`;
    console.log(imageUrl);
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    closeButton.appendChild(img);
  
    // Добавление кнопки на страницу
    document.body.appendChild(closeButton);
  
    // Обработчик события для кнопки
    closeButton.addEventListener("click", () => {
      console.log("Кнопка закрытия нажата");
      ipcRenderer.send("window-hide");
    });
  
    return closeButton;
  }
  
module.exports = createCloseButton;
