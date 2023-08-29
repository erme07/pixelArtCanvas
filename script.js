const $lienzo = document.querySelector(".canvas"),
  $menu = document.querySelector(".menu"),
  $picker = document.querySelector(".picker"),
  $pickerInner = document.querySelector(".picker__inner"),
  $pickerText = document.querySelector(".pickerText"),
  $body = document.querySelector("body"),
  $main = document.querySelector("main");
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

let currentColor = '#000000';
let hue = 0;

let hsvSaturation = 1;
let hsvValue = 1;

const createPen = (pickerColor) => {
  pickerColor = currentColor;
  cursorPen = `<svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m 12.1,0.146 a 0.5,0.5 0 0 1 0.8,0 l 3,3.004 a 0.5,0.5 0 0 1 0,0.7 L 5.85,13.9 A 0.5,0.5 0 0 1 5.69,14 l -5.004,2 a 0.5,0.5 0 0 1 -0.65,-0.7 l 2.004,-5 a 0.5,0.5 0 0 1 0.11,-0.2 z" /><path d="M 11.2,2.5 13.5,4.79 14.8,3.5 12.5,1.21 Z" fill="#ffffff" /><path d="M 12.8,5.5 10.5,3.21 4,9.71 V 10 H 4.5 A 0.5,0.5 0 0 1 5,10.5 V 11 H 5.5 A 0.5,0.5 0 0 1 6,11.5 V 12 h 0.29 z" fill="#ffffff" /><path d="M 3.03,10.7 2.93,10.8 1.4,14.6 5.22,13.1 5.33,13 A 0.5,0.5 0 0 1 5,12.5 V 12 H 4.5 A 0.5,0.5 0 0 1 4,11.5 V 11 H 3.5 A 0.5,0.5 0 0 1 3.03,10.7 Z" fill="${pickerColor}" /></svg>`;
  $lienzo.style.cursor = `url(data:image/svg+xml;base64,${btoa(cursorPen)})0 16, auto`;
}
const draw = () => {
  $menu.children[3].classList.remove("active");
  $menu.children[2].classList.add("active");
  createPen();
  $lienzo.classList.remove("cursorEraser")
  eraser = false;
}
const erase = () => {
  $menu.children[2].classList.remove("active");
  $menu.children[3].classList.add("active");
  $lienzo.style.cursor = ""
  $lienzo.classList.add("cursorEraser")
  eraser = true
}
const clear = () => {
  let confirma = confirm("Do you really want to clean the canvas?");
  if (!confirma) return;
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

const showHideGrid = () => {
  $menu.children[5].classList.toggle("active");
  $lienzo.classList.toggle("noline");
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
    // e.preventDefault()
    clear();
  }
  else if (e.target.getAttribute("name") === "grid") {
    showHideGrid();
  }
})

$lienzo.addEventListener("mousedown", (e) => {
  press = true;
  if (!eraser)
    e.target.style.backgroundColor = currentColor
  else
    e.target.style.backgroundColor = "transparent"
})

document.addEventListener("mouseup", (e) => {
  press = false;
})

$lienzo.addEventListener(events[deviceType], (e) => {

  if (detectDevice()) {
    e.preventDefault()
    let elementId = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).id;
    if (!eraser)
      document.getElementById(elementId).style.backgroundColor = currentColor;
    else if (eraser)
      document.getElementById(elementId).style.backgroundColor = "transparent"
  } else {
    if (press && !eraser && e.target.classList.contains("cell"))
      e.target.style.backgroundColor = currentColor
    else if (press && eraser && e.target.classList.contains("cell"))
      e.target.style.backgroundColor = "transparent"
  }
})

document.addEventListener("resize", () => {
  numCeldas = detectWidth();
  makeGrid()
  $lienzo.innerHTML = "";
  $lienzo.appendChild(grilla);
})




const colorIndicator = document.getElementById('options-color');
const colorPicker = document.querySelector('.color-picker');
const pickerContainer = document.querySelector('.picker-container');
const buttonPicker = document.querySelector('.picker');

const spectrumCanvas = document.getElementById('spectrum-canvas');
const spectrumMap = document.getElementById('spectrum-map');
const spectrumCtx = spectrumCanvas.getContext('2d');
const spectrumCursor = document.getElementById('spectrum-cursor');
let spectrumRect = spectrumCanvas.getBoundingClientRect();

const hueCanvas = document.getElementById('hue-canvas');
const hueMap = document.getElementById("hue-map");
const hueCtx = hueCanvas.getContext('2d');
const hueCursor = document.getElementById('hue-cursor');
let hueRect = hueCanvas.getBoundingClientRect();



const gg = document.querySelector(".button-copy")
const hex = document.getElementById('hex');



const refreshElementRects = () => {
  spectrumRect = spectrumCanvas.getBoundingClientRect();
  hueRect = hueCanvas.getBoundingClientRect();
}

const createSpectrum = (color) => {
  ctx = spectrumCtx;
  if (!color) color = '#f00';

  const mainGradient = ctx.createLinearGradient(0, 0, spectrumCanvas.width, 0);
  mainGradient.addColorStop(0, "#fff");
  mainGradient.addColorStop(1, color);

  const blackGradient = ctx.createLinearGradient(0, 0, 0, spectrumCanvas.height);
  blackGradient.addColorStop(0, "transparent");
  blackGradient.addColorStop(1, "#000");

  ctx.fillStyle = mainGradient;
  ctx.fillRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
  ctx.fillStyle = blackGradient;
  ctx.fillRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);

};


const createHue = () => {
  const ctx = hueCtx;
  const hueGradient = ctx.createLinearGradient(0, 0, hueCanvas.width, 0);
  hueGradient.addColorStop(0.00, "#FF0000");
  hueGradient.addColorStop(0.17, "#FA00FF");
  hueGradient.addColorStop(0.33, "#0400FF");
  hueGradient.addColorStop(0.50, "#00FFFF");
  hueGradient.addColorStop(0.67, "#04FF00");
  hueGradient.addColorStop(0.83, "#FAFF00");
  hueGradient.addColorStop(1.00, "#FF0000");
  ctx.fillStyle = hueGradient;
  ctx.fillRect(0, 0, hueCanvas.width, hueCanvas.height);
};


const colorToPos = (color) => {
  const hsv = tinycolor(color).toHsv();
  hue = hsv.h;
  const x = spectrumRect.width * hsv.s;
  const y = spectrumRect.height * (1 - hsv.v);
  const hueX = hueRect.width - ((hue / 360) * hueRect.width);
  updateSpectrumCursor(x, y);
  updateHueCursor(hueX, tinycolor('hsv ' + hue + ' 1 1').toHexString());
  setCurrentColor(color);
  createSpectrum(tinycolor('hsv ' + hue + ' 1 1').toHexString());
};

const setColorValues = (color) => {
  hex.value = color;
};

const setCurrentColor = (color) => {
  currentColor = color;
  colorIndicator.style.backgroundColor = color;
  $pickerInner.style.backgroundColor = color;
};

const updateHueCursor = (x, color) => {
  hueCursor.style.left = x + "px";
  // hueCursor.style.backgroundColor = color;
}

const updateSpectrumCursor = (x, y) => {
  spectrumCursor.style.left = x + 'px';
  spectrumCursor.style.top = y + 'px';
};

const startGetSpectrumColor = (e) => {
  document.body.classList.add("bodyMove");
  hueCanvas.classList.add("bodyMove");
  hueCursor.classList.add("bodyMove");
  $lienzo.style.cursor = ``;
  // document.body.style.cursor = 'move';
  getSpectrumColor(e);
  document.addEventListener('mousemove', getSpectrumColor);
  document.addEventListener('mouseup', endGetSpectrumColor);
};

const getPositionColor = () => {
  let cordX = Number(spectrumCursor.style.left.replace("px", ""));
  let cordY = Number(spectrumCursor.style.top.replace("px", ""));;
  const xRatio = cordX / spectrumRect.width * 100;
  const yRatio = cordY / spectrumRect.height * 100;
  hsvValue = 1 - (yRatio / 100);
  hsvSaturation = xRatio / 100;
  return tinycolor('hsv ' + hue + ' ' + hsvSaturation + ' ' + hsvValue).toHexString();
}

const getSpectrumColor = (e) => {
  e.preventDefault();
  refreshElementRects();
  let x = e.pageX - spectrumRect.left;
  let y = e.pageY - spectrumRect.top;

  if (x > spectrumRect.width) { x = spectrumRect.width }
  if (x < 0) { x = 0 }
  if (y > spectrumRect.height) { y = spectrumRect.height }
  if (y < 0) { y = 0 }

  updateSpectrumCursor(x, y);
  const color = getPositionColor();
  setCurrentColor(color);
  setColorValues(color);

};

function endGetSpectrumColor(e) {

  document.removeEventListener('mousemove', getSpectrumColor);
  hueCanvas.classList.remove("bodyMove");
  hueCursor.classList.remove("bodyMove");
  document.body.classList.remove("bodyMove")
  createPen();
};



const getHueColor = (e) => {
  e.preventDefault();
  refreshElementRects();
  let x = e.pageX - hueRect.left;
  if (x > hueRect.width) x = hueRect.width;
  if (x < 0) x = 0;
  const percent = x / hueRect.width;
  hue = 360 - (360 * percent);

  const hueColor = tinycolor('hsv ' + hue + ' 1 1').toHexString();
  const color = getPositionColor();


  createSpectrum(hueColor);
  updateHueCursor(x, hueColor);
  setCurrentColor(color);
  setColorValues(color);
};

const endGetHueColor = (e) => {
  document.removeEventListener('mousemove', getHueColor);
  spectrumCanvas.classList.remove("bodyEresize");
  spectrumCursor.classList.remove("bodyEresize");
  document.body.classList.remove("bodyEresize")
};

const startGetHueColor = (e) => {
  document.body.classList.add("bodyEresize");
  spectrumCanvas.classList.add("bodyEresize");
  spectrumCursor.classList.add("bodyEresize");
  $lienzo.style.cursor = ``;
  getHueColor(e);
  document.addEventListener('mousemove', getHueColor);
  document.addEventListener('mouseup', endGetHueColor);
}


gg.addEventListener("click", (e) => {
  navigator.clipboard.writeText(hex.value);
})


createSpectrum();
createHue();

spectrumMap.addEventListener('mousedown', function (e) {
  startGetSpectrumColor(e);
});

hueMap.addEventListener('mousedown', function (e) {
  startGetHueColor(e);
});


hex.addEventListener("input", (e) => {
  let go = tinycolor(e.target.value);
  if (go.isValid()) {
    e.target.classList.remove("hex--error")
    e.target.classList.add("hex--succes")
  }
  else {
    e.target.classList.remove("hex--succes")
    e.target.classList.add("hex--error")
  }
  colorToPos(go.toHexString());
})

colorPicker.style.top = $picker.getBoundingClientRect().bottom + 5 + 'px';

buttonPicker.addEventListener('click', (e) => {
  colorPicker.classList.toggle('show');
  document.querySelector('.overlay').classList.toggle('show');
})

document.addEventListener('click', (e) => {
  if (e.target.getAttribute('data-value') === 'close') {
    colorPicker.classList.toggle('show');
    document.querySelector('.overlay').classList.toggle('show');
  }
})
