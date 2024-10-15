function saveLoginData(email, password) {
    let loginData = JSON.parse(localStorage.getItem('logins')) || [];
  
    loginData = loginData.filter(data => data.email !== email);
    loginData.push({ email, password });
  
    localStorage.setItem('logins', JSON.stringify(loginData));
  }
  
  function getLoginData() {
    return JSON.parse(localStorage.getItem('logins')) || [];
  }

  function getLastLogin() {
    const loginData = getLoginData();
    return loginData.length > 0 ? loginData[loginData.length - 1] : null; // Возвращаем последний элемент
  }
  
  module.exports = {
    saveLoginData,
    getLoginData,
    getLastLogin 
  };