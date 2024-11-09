const { ipcRenderer } = require('electron');

// Кнопка для закрытия окна
document.getElementById('close-btn').addEventListener('click', () => {
  ipcRenderer.send('window-hide');
});

// Загрузка веб-контента
function loadWebContent() {
  const webContent = document.getElementById('web-content');

  // Создаем новый элемент <object> для загрузки веб-сайта
  const object = document.createElement('object');
  object.data = 'https://netmax.network';
  object.style.width = '100%';
  object.style.height = '100%';
  object.style.border = 'none';

  webContent.appendChild(object);
}

loadWebContent();

