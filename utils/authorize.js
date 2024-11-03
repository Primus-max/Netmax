const { saveLoginData, getLastLogin } = require('../store/localStorageStore.js');
const {createLoginDropdown} = require('./htmlGeneratorUtils.js');
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

// Сохранение авторизационных данных
  function trackLoginForm() {
    const emailInput = document.getElementById("pxp-signin-modal-email");
    const passwordInput = document.getElementById("pxp-signin-modal-password");
    const submitButton = document.querySelector(".pxp-signin-modal-btn");
  
    if (emailInput && passwordInput && submitButton) {
      submitButton.addEventListener("click", (event) => {
        event.preventDefault();
  
        const email = emailInput.value;
        const password = passwordInput.value;
  
        saveLoginData(email, password);
        localStorage.setItem("isLoggedOut", "false");  
      });
    } else {
      console.log("Input fields or submit button not found");
    }
  }

// Метод для автоматической авторизации
 function autoLogin() {
  const lastLogin = getLastLogin(); // получаем последний логин

  if (lastLogin) {
    const emailInput = document.getElementById("pxp-signin-modal-email");
    const passwordInput = document.getElementById("pxp-signin-modal-password");
    const submitButton = document.querySelector(".pxp-signin-modal-btn");

    if (emailInput && passwordInput) {
      emailInput.value = lastLogin.email; 
      passwordInput.value = lastLogin.password;             

      if (submitButton) {
        submitButton.click();
      } else {
        console.error("Submit button not found");
      }      
    }
  }
}



  module.exports = {authorize, trackLoginForm, autoLogin};