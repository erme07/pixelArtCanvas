const $lienzo = document.querySelector(".canvas"),
  $menu = document.querySelector(".menu"),
  $picker = document.querySelector(".picker"),
  $body = document.querySelector("body"),
  events = {
    mouse: "mousemove",
    touch: "touchmove"
  }
let press = false,
  eraser = false,
  grilla = document.createDocumentFragment(),
  deviceType = "",
  numCeldas = "",
  pickerColor = "",
  cursorPen = "";

const createPen = () => {
  pickerColor = $picker.value;
  cursorPen = `<svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m 12.1,0.146 a 0.5,0.5 0 0 1 0.8,0 l 3,3.004 a 0.5,0.5 0 0 1 0,0.7 L 5.85,13.9 A 0.5,0.5 0 0 1 5.69,14 l -5.004,2 a 0.5,0.5 0 0 1 -0.65,-0.7 l 2.004,-5 a 0.5,0.5 0 0 1 0.11,-0.2 z" /><path d="M 11.2,2.5 13.5,4.79 14.8,3.5 12.5,1.21 Z" fill="#ffffff" /><path d="M 12.8,5.5 10.5,3.21 4,9.71 V 10 H 4.5 A 0.5,0.5 0 0 1 5,10.5 V 11 H 5.5 A 0.5,0.5 0 0 1 6,11.5 V 12 h 0.29 z" fill="#ffffff" /><path d="M 3.03,10.7 2.93,10.8 1.4,14.6 5.22,13.1 5.33,13 A 0.5,0.5 0 0 1 5,12.5 V 12 H 4.5 A 0.5,0.5 0 0 1 4,11.5 V 11 H 3.5 A 0.5,0.5 0 0 1 3.03,10.7 Z" fill="${pickerColor}" /></svg>`;
  $lienzo.style.cursor = `url(data:image/svg+xml;base64,${btoa(cursorPen)})0 16, auto`;
}
const draw = () => {
  $menu.children[2].classList.remove("active");
  $menu.children[1].classList.add("active");
  createPen();
  $lienzo.classList.remove("cursorEraser")
  eraser = false;
}
const erase = () => {
  $menu.children[1].classList.remove("active");
  $menu.children[2].classList.add("active");
  $lienzo.style.cursor = ""
  $lienzo.classList.add("cursorEraser")
  eraser = true
}
const clear = () => {
  $picker.value = "#000000"
  draw()
  $lienzo.childNodes.forEach((e) => {
    e.style.backgroundColor = "transparent";
  })
  eraser = false;
}
const detectDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    $menu.classList.remove("menu--desktop")
    return true;
  } catch (e) {
    deviceType = "mouse";
    $menu.classList.add("menu--desktop")
    return false;
  }
}
const detectWidth = () => {
  if ($body.clientWidth >= 768)
    return 4950;
  else if ($body.clientWidth >= 576)
    return 2014;
  else
    return 988;
}

const makeGrid = () => {
  for (i = 0; i < numCeldas; i++) {
    const celda = document.createElement("DIV");
    celda.classList.add("cell")
    celda.id = `cell${i + 1}`
    grilla.appendChild(celda)
  }
}

createPen();
detectDevice();
numCeldas = detectWidth();
makeGrid();

$lienzo.appendChild(grilla);

$menu.addEventListener("click", (e) => {
  if (e.target.getAttribute("name") === "draw")
    draw();
  else if (e.target.getAttribute("name") === "erase")
    erase();
  else if (e.target.getAttribute("name") === "clear") {
    e.preventDefault()
    clear();
  }
})

$lienzo.addEventListener("mousedown", (e) => {
  press = true;
  if (!eraser)
    e.target.style.backgroundColor = $picker.value
  else
    e.target.style.backgroundColor = "transparent"
})

document.addEventListener("mouseup", (e) => {
  press = false;
})

$lienzo.addEventListener(events[deviceType], (e) => {
  if (detectDevice()) {
    e.preventDefault()
    let elementId = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).id
    if (!eraser)
      document.getElementById(elementId).style.backgroundColor = $picker.value;
    else if (eraser)
      document.getElementById(elementId).style.backgroundColor = "transparent"
  } else {
    if (press && !eraser && e.target.classList.contains("cell"))
      e.target.style.backgroundColor = $picker.value
    else if (press && eraser && e.target.classList.contains("cell"))
      e.target.style.backgroundColor = "transparent"
  }
})

window.addEventListener("resize", () => {
  numCeldas = detectWidth();
  makeGrid()
  $lienzo.innerHTML = "";
  $lienzo.appendChild(grilla);
})

$picker.addEventListener("change", () => {
  createPen();
})