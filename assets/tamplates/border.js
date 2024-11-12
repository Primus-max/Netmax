
function setWindowWithBorder(mainWindow) {
  mainWindow.webContents.executeJavaScript(`
      (function() {
          // Удаляем старый стиль, если он уже существует
          const existingStyle = document.getElementById('custom-border-style');
          if (existingStyle) {
              existingStyle.remove();
          }

          // Создаем и добавляем новый стиль с уникальным ID
          const style = document.createElement('style');
          style.id = 'custom-border-style';
          style.innerHTML = \`
              html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: hidden;
              }

              html {
                border: 3px solid gray;
                box-sizing: border-box;
              }

              body {
                -webkit-app-region: drag;
              }

              * {
                -webkit-app-region: no-drag;
              }
          \`;
          document.head.appendChild(style);
      })();
  `);
}

function setWindowWithoutBorder(mainWindow) {
  mainWindow.webContents.executeJavaScript(`
      (function() {
          // Удаляем старый стиль, если он уже существует
          const existingStyle = document.getElementById('custom-border-style');
          if (existingStyle) {
              existingStyle.remove();
          }

          // Создаем и добавляем новый стиль с уникальным ID
          const style = document.createElement('style');
          style.id = 'custom-border-style';
          style.innerHTML = \`
              html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: hidden;
              }

              html {
                border: none;
                box-sizing: border-box;
              }

              body {
                -webkit-app-region: drag;
              }

              * {
                -webkit-app-region: no-drag;
              }
          \`;
          document.head.appendChild(style);
      })();
  `);
}



module.exports = { setWindowWithBorder, setWindowWithoutBorder };