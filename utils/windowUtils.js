function handleMouseMoveUpdate() {
    window.addEventListener("mousedown", (event) => {                
      if (event.button === 4) {                 
        console.log('update page');
        location.reload();
      }
    });
  }
  

module.exports = { handleMouseMoveUpdate };