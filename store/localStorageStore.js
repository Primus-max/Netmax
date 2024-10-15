function saveLoginData(username, password) {
    let loginData = JSON.parse(localStorage.getItem('logins')) || [];
  
    loginData = loginData.filter(data => data.username !== username);
    loginData.push({ username, password });
  
    localStorage.setItem('logins', JSON.stringify(loginData));
  }
  
  function getLoginData() {
    return JSON.parse(localStorage.getItem('logins')) || [];
  }
  
  module.exports = {
    saveLoginData,
    getLoginData
  };