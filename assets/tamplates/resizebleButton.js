const path = require("path");

function createButton(id, rightPosition, imageName) {
    const button = document.createElement("button");
    button.id = id;

    // Стиль кнопки
    button.style.position = "fixed";
    button.style.top = "15px";
    button.style.right = `${rightPosition}px`;
    button.style.zIndex = "10000";
    button.style.padding = "0";
    button.style.backgroundColor = "transparent";
    button.style.border = "none";
    button.style.width = "20px";
    button.style.height = "20px";
    button.style.cursor = "pointer";

    // Путь к изображению кнопки
    const imagePath = path.join(__dirname, '..', 'images', imageName);
    const imageUrl = `file://${imagePath}`;
    console.log(imageUrl);

    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    button.appendChild(img);

    document.body.appendChild(button);

    return button;
}

function createMinimizeButton() {
    return createButton("minimize-btn", 41, "minimize.png");
}

function createMaximizeButton() {
    return createButton("maximize-btn", 72, "maximise.png");
}


module.exports = {createMinimizeButton, createMaximizeButton};