const lienzo = document.querySelector(".canvas"),
  menu = document.querySelector(".menu"),
  picker = document.querySelector(".picker");

let press = false,
  eraser = false,
  grilla = document.createDocumentFragment();

const draw = () => {
  menu.children[2].classList.remove("active");
  menu.children[1].classList.add("active");
  lienzo.classList.add("cursorPen");
  lienzo.classList.remove("cursorEraser")
  eraser = false;
}

const erase = () => {
  menu.children[1].classList.remove("active");
  menu.children[2].classList.add("active");
  lienzo.classList.remove("cursorPen");
  lienzo.classList.add("cursorEraser")
  eraser = true
}

const clear = () => {
  draw()
  lienzo.childNodes.forEach((e) => {
    e.style.backgroundColor = "transparent";
  })
  picker.value = "#000000"
  eraser = false;
}

for (i = 0; i < 1064; i++) {
  const celda = document.createElement("DIV");
  celda.classList.add("cell")
  celda.id = `cell${i + 1}`
  grilla.appendChild(celda)
}

lienzo.appendChild(grilla);

menu.addEventListener("click", (e) => {
  if (e.target.getAttribute("name") === "draw")
    draw();
  else if (e.target.getAttribute("name") === "erase")
    erase();
  else if (e.target.getAttribute("name") === "clear")
    clear();
})

lienzo.addEventListener("mousedown", (e) => {
  press = true;
  if (!eraser)
    e.target.style.backgroundColor = picker.value
  else
    e.target.style.backgroundColor = "transparent"
})

lienzo.addEventListener("mouseup", (e) => {
  press = false;
})

lienzo.addEventListener("mousemove", (e) => {
  if (press && !eraser)
    e.target.style.backgroundColor = picker.value
  else if (press && eraser)
    e.target.style.backgroundColor = "transparent"
})