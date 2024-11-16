function handleMouseMoveUpdate() {
    window.addEventListener("mousedown", (event) => {                
      if (event.button === 4) {    
        console.log('reload page');        
        // event.preventDefault(); 
        // history.pushState(null, "", location.href); 
        location.reload();
      }
    });
  }
  

module.exports = { handleMouseMoveUpdate };