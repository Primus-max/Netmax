// Авторизация
function authorize() {
    const protectionForm = document.querySelector(".ppw-swp-form");
    if (protectionForm) {   
      const passwordInput = protectionForm.querySelector(
        "#input_wp_protect_password"
      );
      if (passwordInput) {      
        const pass = "HTY5GTfdJDRUT4#YH#UJDHerdS7$JsW2Fh@h"; //await keytar.getPassword("netmax", "password");
        passwordInput.value = pass;      
      } else {
        console.error("Password input not found");
      }
  
      const submitButton = protectionForm.querySelector(
        "input.button.button-primary.button-login"
      );
      if (submitButton) {      
        submitButton.click();
      } else {
        console.error("Submit button not found");
      }
    } 
  }


  module.exports = {authorize};