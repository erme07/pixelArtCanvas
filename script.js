const lienzo = document.querySelector(".canvas")
const menu = document.querySelector(".menu")
const picker = document.querySelector(".picker")

let grilla = document.createDocumentFragment();
for (i = 0; i < 980; i++) {
  const celda = document.createElement("DIV");
  celda.classList.add("cell")
  celda.id = `cell${i + 1}`
  grilla.appendChild(celda)
}
lienzo.appendChild(grilla);

const draw = () => {
  menu.children[2].classList.remove("active");
  menu.children[1].classList.add("active");
  lienzo.classList.add("cursorPen");
  lienzo.classList.remove("cursorEraser")
}

const erase = () => {
  menu.children[1].classList.remove("active");
  menu.children[2].classList.add("active");
  lienzo.classList.remove("cursorPen");
  lienzo.classList.add("cursorEraser")
}

const clear = () => {
  draw()
  picker.value = "#000000"
}

menu.addEventListener("click", (e) => {
  if (e.target.getAttribute("name") === "draw") {
    draw();
  }
  else if (e.target.getAttribute("name") === "erase") {
    erase();
  }
  else if (e.target.getAttribute("name") === "clear") {
    clear();
  }
})