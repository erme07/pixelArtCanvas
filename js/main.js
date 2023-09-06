
const $buttonDraw = document.querySelector("[data-action='draw']"),
  $buttonEraser = document.querySelector("[data-action='erase']"),
  $buttonGrid = document.querySelector("[data-action='grid']"),
  $pickerColor = document.querySelector(".picker__color"),
  $cleanConfirm = document.getElementById('cleanConfirm'),
  $body = document.querySelector("body"),
  cuadricula = document.getElementById("grid");

const mainCanvas = document.getElementById('canvas'),
  drawingContext = mainCanvas.getContext("2d");



let grid = document.createDocumentFragment(),
  deviceType = "",
  cursorPen = "";

const $colorPicker = document.querySelector('.color-picker'),

  $spectrumCanvas = document.getElementById('spectrum-canvas'),
  $spectrumMap = document.getElementById('spectrum-map'),
  spectrumCtx = $spectrumCanvas.getContext('2d'),
  $spectrumCursor = document.getElementById('spectrum-cursor'),

  $hueCanvas = document.getElementById('hue-canvas'),
  $hueMap = document.getElementById("hue-map"),
  hueCtx = $hueCanvas.getContext('2d'),
  $hueCursor = document.getElementById('hue-cursor'),

  $hex = document.getElementById('hex');

let hueRect = $hueCanvas.getBoundingClientRect(),
  spectrumRect = $spectrumCanvas.getBoundingClientRect(),
  hue = 0,
  hsvSaturation = 1,
  hsvValue = 1,
  press = false,
  eraser = false,
  currentColor = '#000000';

const createPen = () => {
  cursorPen = `<svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m 12.1,0.146 a 0.5,0.5 0 0 1 0.8,0 l 3,3.004 a 0.5,0.5 0 0 1 0,0.7 L 5.85,13.9 A 0.5,0.5 0 0 1 5.69,14 l -5.004,2 a 0.5,0.5 0 0 1 -0.65,-0.7 l 2.004,-5 a 0.5,0.5 0 0 1 0.11,-0.2 z" /><path d="M 11.2,2.5 13.5,4.79 14.8,3.5 12.5,1.21 Z" fill="#ffffff" /><path d="M 12.8,5.5 10.5,3.21 4,9.71 V 10 H 4.5 A 0.5,0.5 0 0 1 5,10.5 V 11 H 5.5 A 0.5,0.5 0 0 1 6,11.5 V 12 h 0.29 z" fill="#ffffff" /><path d="M 3.03,10.7 2.93,10.8 1.4,14.6 5.22,13.1 5.33,13 A 0.5,0.5 0 0 1 5,12.5 V 12 H 4.5 A 0.5,0.5 0 0 1 4,11.5 V 11 H 3.5 A 0.5,0.5 0 0 1 3.03,10.7 Z" fill="${currentColor}" /></svg>`;
  mainCanvas.style.cursor = `url(data:image/svg+xml;base64,${btoa(cursorPen)})0 16, auto`;
}
const draw = () => {
  $buttonEraser.classList.remove("active");
  $buttonDraw.classList.add("active");
  createPen();
  mainCanvas.classList.remove("cursorEraser")
  eraser = false;
}
const erase = () => {
  $buttonDraw.classList.remove("active");
  $buttonEraser.classList.add("active");
  mainCanvas.style.cursor = ""
  mainCanvas.classList.add("cursorEraser")
  eraser = true
}
const clear = () => {
  draw()
  drawingContext.fillStyle = "#ffffff";
  drawingContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  $cleanConfirm.classList.toggle('show')
  document.querySelector('.overlay--confirm').classList.toggle('show');
  eraser = false;
}
const detectDevice = () => {
  try {
    document.createEvent("TouchEvent");
    return 'touchmove';
  } catch (e) {
    return 'mousemove';
  }
}
const setWidth = (widthValue, heightValue) => {
  mainCanvas.width = widthValue;
  mainCanvas.height = heightValue;
}
const detectWidth = () => {
  if ($body.clientWidth >= 768) {
    setWidth(720, 440);
    return 90;
  } else if ($body.clientWidth >= 576) {
    setWidth(530, 380);
    return 53;
  } else {
    setWidth(260, 380);
    return 26;
  }
}
const showHideGrid = () => {
  $buttonGrid.classList.toggle("active");
  cuadricula.classList.toggle("grid--active");
}
const fillCell = (x, y) => {
  const cellX = Math.floor(x / cellPixelLength);
  const cellY = Math.floor(y / cellPixelLength);
  const startX = cellX * cellPixelLength;
  const startY = cellY * cellPixelLength;
  if (!eraser)
    drawingContext.fillStyle = currentColor;
  else
    drawingContext.fillStyle = "#ffffff";
  drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
}

/////

const refreshElementRects = () => {
  spectrumRect = $spectrumCanvas.getBoundingClientRect();
  hueRect = $hueCanvas.getBoundingClientRect();
}

const createSpectrum = (color = '#ff0000') => {
  let ctx = spectrumCtx;
  const mainGradient = ctx.createLinearGradient(0, 0, $spectrumCanvas.width, 0);
  mainGradient.addColorStop(0, "#fff");
  mainGradient.addColorStop(1, color);
  const blackGradient = ctx.createLinearGradient(0, 0, 0, $spectrumCanvas.height);
  blackGradient.addColorStop(0, "transparent");
  blackGradient.addColorStop(1, "#000");
  ctx.fillStyle = mainGradient;
  ctx.fillRect(0, 0, $spectrumCanvas.width, $spectrumCanvas.height);
  ctx.fillStyle = blackGradient;
  ctx.fillRect(0, 0, $spectrumCanvas.width, $spectrumCanvas.height);
}

const createHue = () => {
  const ctx = hueCtx;
  const hueGradient = ctx.createLinearGradient(0, 0, $hueCanvas.width, 0);
  hueGradient.addColorStop(0.00, "#FF0000");
  hueGradient.addColorStop(0.17, "#FA00FF");
  hueGradient.addColorStop(0.33, "#0400FF");
  hueGradient.addColorStop(0.50, "#00FFFF");
  hueGradient.addColorStop(0.67, "#04FF00");
  hueGradient.addColorStop(0.83, "#FAFF00");
  hueGradient.addColorStop(1.00, "#FF0000");
  ctx.fillStyle = hueGradient;
  ctx.fillRect(0, 0, $hueCanvas.width, $hueCanvas.height);
}

const updateSpectrumCursor = (x, y) => {
  $spectrumCursor.style.left = x + 'px';
  $spectrumCursor.style.top = y + 'px';
}

const updateHueCursor = (x) => $hueCursor.style.left = x + "px";

const setCurrentColor = (color) => {
  currentColor = color;
  $pickerColor.style.backgroundColor = currentColor;
}

const setColorValues = (color) => $hex.value = color;

const colorToPos = (color) => {
  const hsv = tinycolor(color).toHsv();
  hue = hsv.h;
  const x = spectrumRect.width * hsv.s;
  const y = spectrumRect.height * (1 - hsv.v);
  const hueX = hueRect.width - ((hue / 360) * hueRect.width);
  updateSpectrumCursor(x, y);
  updateHueCursor(hueX);
  setCurrentColor(color);
  createSpectrum(tinycolor('hsv ' + hue + ' 1 1').toHexString());
}

const startGetSpectrum = (e) => {
  $body.classList.add('bodyMove');
  $spectrumCanvas.classList.add('bodyMove');
  $spectrumCursor.classList.add('bodyMove');
  $hueCanvas.classList.add('bodyMove');
  $hueCursor.classList.add('bodyMove');
  getSpectrumColor(e)
}

const startGetHue = (e) => {
  $body.classList.add('bodyEresize');
  $spectrumCanvas.classList.add('bodyEresize');
  $spectrumCursor.classList.add('bodyEresize');
  $hueCanvas.classList.add('bodyEresize');
  $hueCursor.classList.add('bodyEresize');
  getHueColor(e)
}

const getPositionColor = () => {
  let cordX = Number($spectrumCursor.style.left.replace("px", ""));
  let cordY = Number($spectrumCursor.style.top.replace("px", ""));;
  const xRatio = cordX / spectrumRect.width * 100;
  const yRatio = cordY / spectrumRect.height * 100;
  hsvValue = 1 - (yRatio / 100);
  hsvSaturation = xRatio / 100;
  return tinycolor('hsv ' + hue + ' ' + hsvSaturation + ' ' + hsvValue).toHexString();
}

const getSpectrumColor = (e) => {
  e.preventDefault();
  refreshElementRects();
  let x = 0, y = 0;
  if (e.type === 'touchmove') {
    x = e.touches[0].clientX - spectrumRect.left;
    y = e.touches[0].clientY - spectrumRect.top;
  }
  else {
    x = e.pageX - spectrumRect.left;
    y = e.pageY - spectrumRect.top;
  }
  if (x > spectrumRect.width) { x = spectrumRect.width }
  if (x < 0) { x = 0 }
  if (y > spectrumRect.height) { y = spectrumRect.height }
  if (y < 0) { y = 0 }
  updateSpectrumCursor(x, y);
  const color = getPositionColor();
  setCurrentColor(color);
  setColorValues(color);
}

const getHueColor = (e) => {
  e.preventDefault();
  refreshElementRects();
  let x = 0
  if (e.type === 'touchmove')
    x = e.touches[0].clientX - hueRect.left;
  else
    x = e.pageX - hueRect.left;
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
}

const eyeDropper = () => {
  if ('EyeDropper' in window) {
    const eyeDropper = new window.EyeDropper();
    eyeDropper
      .open()
      .then((result) => {
        $colorPicker.classList.toggle('show');
        colorToPos(result.sRGBHex);
        setColorValues(currentColor);
      })
      .catch(e => {
        console.warn('canceled')
        $colorPicker.classList.toggle('show');
      });
  } else {
    $colorPicker.classList.toggle('show');
    console.warn('No Support: This browser does not support the EyeDropper API yet!');
    alert("This browser does not support the EyeDropper function");
  }
}


deviceType = detectDevice();
let pixelNumber = detectWidth();
drawingContext.fillStyle = "#ffffff";
drawingContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
let cellPixelLength = mainCanvas.width / pixelNumber;
createPen();

$colorPicker.style.top = $pickerColor.getBoundingClientRect().bottom + 16 + 'px';

createSpectrum();
createHue();

//////////

mainCanvas.addEventListener("mousedown", (e) => {
  const canvasBoundingRect = mainCanvas.getBoundingClientRect();
  const x = e.clientX - canvasBoundingRect.left;
  const y = e.clientY - canvasBoundingRect.top;
  if (e.button !== 0) return;
  press = true;
  fillCell(x, y);
})

mainCanvas.addEventListener(deviceType, (e) => {
  const canvasBoundingRect = mainCanvas.getBoundingClientRect();
  if (e.type === 'touchmove') {
    e.preventDefault()
    const x = e.touches[0].clientX - canvasBoundingRect.left;
    const y = e.touches[0].clientY - canvasBoundingRect.top;
    fillCell(x, y);
  } else {
    const x = e.clientX - canvasBoundingRect.left;
    const y = e.clientY - canvasBoundingRect.top;
    if (press) fillCell(x, y)
  }
})

document.addEventListener("mouseup", (e) => {
  press = false
  $body.classList.remove('bodyMove', 'bodyEresize');
  $spectrumCanvas.classList.remove('bodyMove', 'bodyEresize');
  $spectrumCursor.classList.remove('bodyMove', 'bodyEresize');
  $hueCanvas.classList.remove('bodyMove', 'bodyEresize');
  $hueCursor.classList.remove('bodyMove', 'bodyEresize');
  if (!eraser) createPen();
})

window.addEventListener("resize", () => {
  pixelNumber = detectWidth();
  cellPixelLength = mainCanvas.width / pixelNumber
  drawingContext.fillStyle = "#ffffff";
  drawingContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  $colorPicker.style.top = $pickerColor.getBoundingClientRect().bottom + 16 + 'px';
})

document.addEventListener('click', (e) => {
  if (e.target.getAttribute("data-action") === "draw")
    draw();
  else if (e.target.getAttribute("data-action") === "erase")
    erase();
  else if (e.target.getAttribute("data-action") === "clear") {
    $cleanConfirm.classList.toggle('show')
    document.querySelector('.overlay--confirm').classList.toggle('show');
  }
  else if (e.target.getAttribute("data-action") === "grid")
    showHideGrid();
  else if (e.target.getAttribute('data-value') === 'accept')
    clear()
  else if (e.target.getAttribute('data-value') === 'cancel') {
    $cleanConfirm.classList.toggle('show')
    document.querySelector('.overlay--confirm').classList.toggle('show');
  }
  else if (e.target.getAttribute('data-action') === 'show-hide') {
    $colorPicker.classList.toggle('show');
    document.querySelector('.overlay').classList.toggle('show');
    document.querySelector('.picker__overlay').classList.toggle('show');
  }
  else if (e.target.getAttribute("data-action") === "copy")
    navigator.clipboard.writeText($hex.value);
  else if (e.target.getAttribute('data-action') === 'eyeDropper') {
    $colorPicker.classList.toggle('show');
    eyeDropper();
  }
})

$spectrumMap.addEventListener('mousedown', (e) => {
  press = true;
  startGetSpectrum(e)
});

$spectrumMap.addEventListener(deviceType, (e) => {
  if (e.type === 'mousemove' && press)
    getSpectrumColor(e);
  if (e.type === 'touchmove')
    getSpectrumColor(e);
})

$hueMap.addEventListener('mousedown', (e) => {
  press = true;
  startGetHue(e);
});

$hueMap.addEventListener(deviceType, (e) => {
  if (e.type === 'mousemove' && press)
    getHueColor(e);
  if (e.type === 'touchmove')
    getHueColor(e);
})

$hex.addEventListener("input", (e) => {
  let color = tinycolor($hex.value);
  if (color.isValid()) {
    $hex.classList.remove("hex--error")
    $hex.classList.add("hex--succes")
  }
  else {
    $hex.classList.remove("hex--succes")
    $hex.classList.add("hex--error")
  }
  colorToPos(color.toHexString());
})