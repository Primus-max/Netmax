function handleMouseMoveUpdate() {
    window.addEventListener("mousedown", (event) => {     
      if (event.button === 3) { // Боковые кнопки мыши        
        event.preventDefault(); 
        history.pushState(null, "", location.href); // Отключаю навигацию назад
        location.reload();
      }
    });
  }
  

module.exports = { handleMouseMoveUpdate };