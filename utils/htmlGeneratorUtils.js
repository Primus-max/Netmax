const { saveLoginData, getLastLogin, getLoginData } = require('../store/localStorageStore.js');

function createLoginDropdown(emailInput, passwordInput) {
    const logins = getLoginData();

    // Создаем выпадающий список
    const dropdown = document.createElement("ul");
    
    dropdown.style.position = "absolute";
    dropdown.style.top = "58px";
    dropdown.style.listStyleType = "none";
    dropdown.style.padding = "0";
    dropdown.style.margin = "0";
    dropdown.style.backgroundColor = "white";
    dropdown.style.border = "1px solid #ccc";
    dropdown.style.width = "100%";
    dropdown.style.zIndex = "1000";
    dropdown.style.maxHeight = "150px";
    dropdown.style.overflowY = "auto";
    dropdown.hidden = true; 

    logins.forEach((login) => {        
        const item = document.createElement("li");
        item.textContent = login.email;
        item.style.padding = "8px";
        item.style.cursor = "pointer";
        item.style.transition = "background-color 0.3s"; 

        // При выборе логина заполняем email и password
        item.addEventListener("click", () => {
            emailInput.value = login.email;
            passwordInput.value = login.password;
            dropdown.hidden = true;             
        });

        item.addEventListener("mouseenter", () => {
            item.style.backgroundColor = "#f0f0f0";
        });
        item.addEventListener("mouseleave", () => {
            item.style.backgroundColor = "white";
        });

        dropdown.appendChild(item);
    });

    // Добавляем выпадающий список к DOM, рядом с полем email
    emailInput.parentNode.appendChild(dropdown);

    // Устанавливаем позицию выпадающего списка
    const rect = emailInput.getBoundingClientRect();
    dropdown.style.top = "58px"; 
    dropdown.style.left = rect.left + "px"; 

    // Показываем выпадающий список при клике на поле email
    emailInput.addEventListener("focus", () => {
        dropdown.hidden = logins.length === 0; // показываем только если есть логины
    });

    // Скрываем выпадающий список, когда кликаем вне его
    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target) && event.target !== emailInput) {
            dropdown.hidden = true;
        }
    });
}

module.exports = { createLoginDropdown };
