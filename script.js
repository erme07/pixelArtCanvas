const lienzo = document.querySelector(".canvas"),
  menu = document.querySelector(".menu"),
  picker = document.querySelector(".picker");

let press = false,
  eraser = false,
  grilla = document.createDocumentFragment(),
  deviceType = "";

const events = {
  mouse: "mousemove",
  touch: "touchmove"
}

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
  menu.children[3].classList.add("active");
  menu.children[3].classList.remove("active");
  lienzo.childNodes.forEach((e) => {
    e.style.backgroundColor = "transparent";
  })
  picker.value = "#000000"
  eraser = false;
}

const detectDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    menu.classList.remove("menu--desktop")
    return true;
  } catch (e) {
    deviceType = "mouse";

    menu.classList.add("menu--desktop")
    return false;
  }
}
detectDevice();


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
  else if (e.target.getAttribute("name") === "clear") {
    e.preventDefault()
    clear();
  }

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

lienzo.addEventListener(events[deviceType], (e) => {
  if (detectDevice()) {
    e.preventDefault()
    let elementId = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).id
    if (!eraser) {
      document.getElementById(elementId).style.backgroundColor = picker.value;
    } else if (eraser) {
      document.getElementById(elementId).style.backgroundColor = "transparent"
    }
  } else {
    if (press && !eraser)
      e.target.style.backgroundColor = picker.value
    else if (press && eraser)
      e.target.style.backgroundColor = "transparent"
  }

})