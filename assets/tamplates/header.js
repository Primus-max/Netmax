function createHeader() {
  const header = document.createElement("div");
  header.style.position = "fixed";
  header.style.display = "flex";
  header.style.justifyContent = "flex-start";
  header.style.top = "10px";
  header.style.left = "0";
  header.style.backgroundColor = "transparent";
  header.style.height = "30px";
  header.style.width = "89%";
  header.style.zIndex = "10000";
  header.style["-webkit-app-region"] = "drag";

  document.body.appendChild(header);

  header.addEventListener("dblclick", (event) => {
    console.log("Double-click detected");
    event.preventDefault();
  });

  header.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  return header;
}

module.exports = { createHeader };
