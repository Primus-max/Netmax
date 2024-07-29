const path = require("path");

function createCloseButton() {
    const closeButton = document.createElement("button");
    closeButton.id = "close-btn";
    
    // Стиль кнопки
    closeButton.style.position = "fixed";  // Изменили с absolute на fixed
    closeButton.style.top = "15px";
    closeButton.style.right = "15px";
    closeButton.style.zIndex = "10000";
    closeButton.style.padding = "0";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.width = "20px";
    closeButton.style.height = "20px";
    closeButton.style.cursor = "pointer";
    
    // Путь к изображению кнопки
    const imagePath = path.join(__dirname, '..', 'images', 'close.png'); 
    const imageUrl = `file://${imagePath}`;
    console.log(imageUrl); 
    
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    closeButton.appendChild(img);  
    
    document.body.appendChild(closeButton);
  
    return closeButton;
}

module.exports = createCloseButton;
