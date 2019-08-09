const canvas = document.querySelector('.canvas-active');
const ctx = canvas.getContext('2d');
let isDrawing = false;
// x1, y1 - coordinates of start position of cursor
let x1, y1;

// choice size of tool 1-4px
function boxSize() {
  const sizeInput = document.getElementsByName('size');
  let currentBoxSize = 1;
  sizeInput.forEach(size => {
    if (size.checked) {
      currentBoxSize = +size.value;
    }
  });
  return currentBoxSize;
}

// choice size of canvas 32x32, 64x64, 128x128px
function resizeCanvas() {
  const resizeInput = document.getElementsByName('resize');
  let sizeCanvas;

  resizeInput.forEach(resize => {
    if (resize.checked) {
      sizeCanvas = resize.value;
    }
  });

  return sizeCanvas;
}

// resize canvas and save previous image on canvas and frames
function setSizeCanvas() {
  const canvasTemp = document.createElement('canvas');
  const ctxTemp = canvasTemp.getContext('2d');
  const canvas2All = document.querySelectorAll('.canvas2');
  const sizeCanvas = resizeCanvas();
  const deltaSize = (sizeCanvas - canvas.width) / 2;

  ctxTemp.drawImage(canvas, 0, 0);
  canvas.width = canvas.height = sizeCanvas;
  ctx.drawImage(canvasTemp, deltaSize, deltaSize);

  canvas2All.forEach(canvas2 => {
    ctxTemp.drawImage(canvas2, 0, 0);
    canvas2.width = canvas2.height = sizeCanvas;
    const ctx2 = canvas2.getContext('2d');
    ctx2.drawImage(canvasTemp, deltaSize, deltaSize);
  });

  const layer = document.querySelector('.layer');
  layer.width = layer.height = sizeCanvas;
}

// show information about canvas size
function showCanvasSize() {
  const showSize = document.querySelector('.canvas-size span');
  let sizeCanvas = resizeCanvas();
  showSize.innerText = `[${sizeCanvas}x${sizeCanvas}]`;
}

const resizeInput = document.getElementsByName('resize');
resizeInput.forEach(input => input.addEventListener("click", setSizeCanvas));
resizeInput.forEach(input => input.addEventListener("click", showCanvasSize));

// scale the mouse position on canvas
function scale() {
  let pos = canvas.offsetWidth / canvas.width;
  return pos;
}

// get coordinates x1, y1 mouse on canvas
canvas.addEventListener('mousemove', () => {
  let size = boxSize();
  x1 = Math.floor(event.offsetX / scale() / size) * size;
  y1 = Math.floor(event.offsetY / scale() / size) * size;
});

// show information about cursor coordinates
function showCoordinates() {
  const showCoordinates = document.querySelector('.coordinates span');
  showCoordinates.parentNode.style.opacity = '1';
  showCoordinates.innerText = `${x1}:${y1}`;
  canvas.addEventListener('mouseleave', () => showCoordinates.parentNode.style.opacity = '0');
}

canvas.addEventListener('mousemove', showCoordinates);

// get current tool
function currentTool() {
  const toolInput = document.getElementsByName('tool');
  let currentToolValue;
  toolInput.forEach(tool => {
    if (tool.checked) {
      currentToolValue = tool.value;
    }
  });
  return currentToolValue;
}

// disable context menu
window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

// get current color
const activeColor = document.querySelector('.active-color');
const prevColor = document.querySelector('.prev-color');

// detect if the left and only the left mouse button is press
function detectLeftButton(event) {
  event = event || window.event;
  if ("buttons" in event) {
    return event.buttons == 1;
  }
  var button = event.which || event.button;
  return button == 1;
}

// get current color
function currentColor() {
  let activeColorValue;
  if(detectLeftButton()) {
    activeColorValue = activeColor.value;
  } else {
    activeColorValue = prevColor.value;
  }
  return activeColorValue;
}

// change current and prev colors
function changeColor() {
  let temp;
  temp = activeColor.value;
  activeColor.value = prevColor.value;
  prevColor.value = temp;
}

const rotate = document.querySelector('.rotate');
rotate.addEventListener('click', changeColor);

// checked mousedown on the canvas
canvas.addEventListener('mousedown', () => {
  isDrawing = true;
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

canvas.parentNode.addEventListener('mouseleave', () => {
  isDrawing = false;
});

// drawing with mirror pen on the canvas
function mirror(event) {
  if (currentTool() !== 'mirror' || !isDrawing) return;
  ctx.fillStyle = currentColor();
  let size = boxSize();
  const x = Math.floor(event.offsetX / scale() / size) * size;
  const x1 = Math.abs(canvas.width - x - boxSize());
  const y = Math.floor(event.offsetY / scale() / size) * size;

  if (event.ctrlKey) {
    const y1 = Math.abs(canvas.width - y - boxSize());
    ctx.fillRect(x, y, size, size);
    ctx.fillRect(x, y1, size, size);
  } else if (event.shiftKey) {
    const x1 = Math.abs(canvas.width - x - boxSize());
    const y1 = Math.abs(canvas.width - y - boxSize());
    ctx.fillRect(x, y, size, size);
    ctx.fillRect(x1, y, size, size);
    ctx.fillRect(x, y1, size, size);
    ctx.fillRect(x1, y1, size, size);
  } else {
    ctx.fillRect(x, y, size, size);
    ctx.fillRect(x1, y, size, size);
  }
}

// fill canvas with one color
//  https://stackoverflow.com/questions/53077955/how-do-i-do-flood-fill-on-the-html-canvas-in-javascript
function getPixel(imageData, x, y) {
  if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
    return [-1, -1, -1, -1];  // impossible color
  } else {
    const offset = (y * imageData.width + x) * 4;
    return imageData.data.slice(offset, offset + 4);
  }
}

function setPixel(imageData, x, y, color) {
  const offset = (y * imageData.width + x) * 4;
  imageData.data[offset + 0] = color[0];
  imageData.data[offset + 1] = color[1];
  imageData.data[offset + 2] = color[2];
  imageData.data[offset + 3] = color[3];
}

function colorsMatch(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function floodFill(ctx, x, y, fillColor) {
  // read the pixels in the canvas
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  // get the color we're filling
  const targetColor = getPixel(imageData, x, y);

  // check we are actually filling a different color
  if (!colorsMatch(targetColor, fillColor)) {

    const pixelsToCheck = [x, y];
    while (pixelsToCheck.length > 0) {
      const y = pixelsToCheck.pop();
      const x = pixelsToCheck.pop();

      const curColor = getPixel(imageData, x, y);
      if (colorsMatch(curColor, targetColor)) {
        setPixel(imageData, x, y, fillColor);
        pixelsToCheck.push(x + 1, y);
        pixelsToCheck.push(x - 1, y);
        pixelsToCheck.push(x, y + 1);
        pixelsToCheck.push(x, y - 1);
      }
    }

    // put the data back
    ctx.putImageData(imageData, 0, 0);
  }
}

function hexToRgbA(hex){
  let c = hex.substring(1).split('');
  if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = '0x' + c.join('');
  return [(c>>16)&255, (c>>8)&255, c&255, 255];
}

function bucket() {
  if (currentTool() !== 'bucket') return;
  if (event.ctrlKey) {
    ctx.fillStyle = currentColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    let rgbColor = hexToRgbA(currentColor());
    floodFill(ctx, x1, y1, rgbColor);
  }
}

// paint all pixels of the same color
function brush(event) {
  if (currentTool() !== 'brush') return;
  ctx.fillStyle = currentColor();
  // determine color pixel under mouse
  let x = event.offsetX / scale();
  let y = event.offsetY / scale();
  let cellColor = ctx.getImageData(x, y, 1, 1).data.join(',');

  let width = canvas.width;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      if (ctx.getImageData(i, j, 1, 1).data.join(',') === cellColor) {
        ctx.fillRect(i, j, 1, 1)
      }
    }
  }
}

// erasing canvas
function eraser(event) {
  if (currentTool() !== 'eraser' || !isDrawing) return;
  let size = boxSize();
  const x = Math.floor(event.offsetX / scale() / size) * size;
  const y = Math.floor(event.offsetY / scale() / size) * size;
  if (event.ctrlKey) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(x, y, size, size);
  }
}

// drawing line
// https://ru.wikipedia.org/wiki/Алгоритм_Брезенхэма
let canvasCopy = canvas;
const startLine = {};

canvas.addEventListener('mousedown', () => {
  ctx.fillStyle = currentColor();
  canvasCopy = ctx.getImageData(0, 0, canvas.width, canvas.height);
  startLine.x = x1;
  startLine.y = y1;
});

function drawLine(x1, y1, x2, y2) {
  let size = boxSize();
  let deltaX = Math.abs(x2 - x1);
  let deltaY = Math.abs(y2 - y1);
  let signX = x1 < x2 ? 1 : -1;
  let signY = y1 < y2 ? 1 : -1;
  let error = deltaX - deltaY;
  ctx.fillRect(x2, y2, size, size);
  while (x1 != x2 || y1 != y2) {
    ctx.fillRect(x1, y1, size, size);
    let error2 = error * 2;
    if (error2 > -deltaY) {
      error -= deltaY;
      x1 += signX;
    }
    if (error2 < deltaX) {
      error += deltaX;
      y1 += signY;
    }
  }
}

function stroke(event) {
  if (currentTool() !== 'stroke' || !isDrawing) return;
  ctx.putImageData(canvasCopy, 0, 0);
  const endLine = {};
  endLine.x = Math.floor(event.offsetX / scale() / boxSize()) * boxSize();
  endLine.y = Math.floor(event.offsetY / scale() / boxSize()) * boxSize();
  drawLine(startLine.x, startLine.y, endLine.x, endLine.y);
}

// drawing with pen on the canvas
function pen(event) {
  if (currentTool() !== 'pen' || !isDrawing) return;
  const endLine = {};
  endLine.x = Math.floor(event.offsetX / scale() / boxSize()) * boxSize();
  endLine.y = Math.floor(event.offsetY / scale() / boxSize()) * boxSize();
  drawLine(startLine.x, startLine.y, endLine.x, endLine.y);
  startLine.x = endLine.x;
  startLine.y = endLine.y;
}

// drawing rectangle
function rectangle(event) {
  if (currentTool() !== 'rectangle' || !isDrawing) return;
  ctx.putImageData(canvasCopy, 0, 0);
  ctx.lineWidth = boxSize();
  ctx.strokeStyle = currentColor();
  let x2 = Math.floor(event.offsetX / scale());
  let y2 = Math.floor(event.offsetY / scale());

  let width = x2 - startLine.x;
  let height = y2 - startLine.y;

  if (event.shiftKey) {
    if(Math.abs(width) < Math.abs(height)) {
      if(height > 0) {
        height = Math.abs(width);
      } else {
        height = -Math.abs(width);
      }
    } else if(Math.abs(height) < Math.abs(width)) {
      if(width > 0) {
        width = Math.abs(height);
      } else {
        width = -Math.abs(height);
      }
    }
  }
  if (boxSize() === 1 || boxSize() === 3) {
    ctx.strokeRect(startLine.x + 0.5, startLine.y + 0.5, width, height);
  } else {
    ctx.strokeRect(startLine.x, startLine.y, width, height);
  }
}

// drawing circle and ellipse
//Midpoint Algorithm for Circle
// https://github.com/asbeane/midpointAlgorithm
function midPointCircle(x0, y0, r) {
  var x = r;
  var y = 0;

  var error = 1 - x;
  while (x >= y) {
    pixelSet(x, y, x0, y0);
    y = y + 1;
    if (error < 0) {
      error += y * 2 + 1;
    } else {
      x--;
      error += 2 * (y - x) + 1;
    }
    pixelSet(x, y, x0, y0);
  }
}

//Circle Helper
function pixelSet(x, y, startX, startY) {
  ctx.fillRect(x + startX, y + startY, 1, 1);
  ctx.fillRect(startX + y, x + startY, 1, 1);
  ctx.fillRect(startX - x, startY + y, 1, 1);
  ctx.fillRect(startX - y, startY + x, 1, 1);
  ctx.fillRect(startX - x, startY - y, 1, 1);
  ctx.fillRect(startX - y, startY - x, 1, 1);
  ctx.fillRect(x + startX, startY - y, 1, 1);
  ctx.fillRect(startX + y, startY - x, 1, 1);
}

//Mid point Algorithm for ellipse
function midPointEllipse(x0, y0, width, height) {
  var x = 0;
  var y = height;
  var widthSquared = width * width;
  var heightSquared = height * height;

  var i = 0;
  var j = 2 * widthSquared * y;
  pixelSetEllipse(x, y, x0, y0);
  var squaredDiff = heightSquared - (widthSquared * height) + (0.25 * widthSquared);

  while (i < j) {
    x++;
    i = i + 2 * heightSquared;
    if (squaredDiff < 0) {
      squaredDiff = squaredDiff + heightSquared + i;
    } else {
      y--;
      j = j - 2 * widthSquared;
      squaredDiff = squaredDiff + heightSquared + i - j;
    }
    pixelSetEllipse(x, y, x0, y0);
  }

  squaredDiff = heightSquared * ((x + 0.5) * (x + 0.5)) + widthSquared * ((y - 1) * (y - 1)) - widthSquared * heightSquared;
  while (y > 0) {
    y--;
    j = j - 2 * widthSquared;
    if (squaredDiff > 0) {
      squaredDiff = squaredDiff + widthSquared - j;
    } else {
      x++;
      i = i + 2 * heightSquared;
      squaredDiff = squaredDiff + widthSquared - j + i;
    }
    pixelSetEllipse(x, y, x0, y0);
  }
}

//Ellipse Helper
function pixelSetEllipse(x, y, _startX, _startY) {
  ctx.fillRect(_startX + x, _startY + y, 1, 1);
  ctx.fillRect(_startX - x, _startY + y, 1, 1);
  ctx.fillRect(_startX + x, _startY - y, 1, 1);
  ctx.fillRect(_startX - x, _startY - y, 1, 1);
}

function circle(event) {
  if (currentTool() !== 'circle' || !isDrawing) return;
  ctx.putImageData(canvasCopy, 0, 0);
  ctx.fillStyle = currentColor();
  const endLine = {};
  endLine.x = Math.floor(event.offsetX / scale() / boxSize()) * boxSize();
  endLine.y = Math.floor(event.offsetY / scale() / boxSize()) * boxSize();
  let r;
  let r1 = Math.floor(Math.abs(endLine.x - startLine.x) / 2);
  let r2 = Math.floor(Math.abs(endLine.y - startLine.y) / 2);
  r1 < r2 ? r = r1 : r = r2;
  if(startLine.x < endLine.x && startLine.y < endLine.y) {
    if (event.shiftKey) {
      midPointCircle(x1 - r, y1 - r, r);
    } else {
      midPointEllipse(x1 - r1, y1 - r2, r1, r2);
    }
  } else if(startLine.x > endLine.x && startLine.y > endLine.y) {
    if (event.shiftKey) {
      midPointCircle(startLine.x - r, startLine.y - r, r);
    } else {
      midPointEllipse(startLine.x - r1, startLine.y - r2, r1, r2);
    }
  }  else if (startLine.x < endLine.x && startLine.y > endLine.y) {
    if (event.shiftKey) {
        midPointCircle(x1 - r, startLine.y - r, r);
      } else {
        midPointEllipse(x1 - r1, startLine.y - r2, r1, r2);
      }
  } else if (startLine.x > endLine.x && startLine.y < endLine.y) {
    if (event.shiftKey) {
        midPointCircle(startLine.x - r, y1 - r, r);
      } else {
        midPointEllipse(startLine.x - r1, y1 - r2, r1, r2);
      }
  }
}

// move canvas
function move() {
  if (currentTool() !== 'move' || !isDrawing) return;
  ctx.putImageData(canvasCopy, 0, 0);
  let deltax = x1 - startLine.x;
  let deltay = y1 - startLine.y;
  let imageData = ctx.getImageData(0, 0, canvas.width - deltax, canvas.height - deltay);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imageData, deltax, deltay);
}

// selection canvas area with same color
function shape() {
  if (currentTool() !== 'shape' || !isDrawing) return;
  ctx.putImageData(canvasCopy, 0, 0);
  const rgbColor = [79, 181, 227, 115];
  floodFill(ctx, x1, y1, rgbColor);
  let imageData = ctx.getImageData(startLine.x, startLine.y, canvas.width, canvas.height);
  ctx.putImageData(imageData, x2, y2);
}

// rotation canvas
// http://qaru.site/questions/6704867/rotate-canvas-90-degrees-clockwise-and-update-width-height
function rotation(event) {
  const myImageData = new Image();
  myImageData.src = canvas.toDataURL();
  ctx.save();
  if (event.ctrlKey) {
    ctx.translate(canvas.width, 1);
    ctx.rotate(Math.PI / 2);
  } else {
    ctx.translate(1, canvas.width);
    ctx.rotate(3 * Math.PI / 2);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  myImageData.onload = function() {
    ctx.drawImage(myImageData, 0, 0);
    ctx.restore();
  }
}

const rotationButton = document.querySelector('.rotation');
rotationButton.addEventListener('mousedown', rotation);

// flipflop
function flipflop(event) {
  const myImageData = new Image();
  myImageData.src = canvas.toDataURL();
  ctx.save();
  if(event.ctrlKey) {
    ctx.translate(0, canvas.width);
    ctx.scale(1, -1);
  } else {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  myImageData.onload = function() {
    ctx.drawImage(myImageData, 0, 0);
    ctx.restore();
  }
}

const flipflopButton = document.querySelector('.flipflop');
flipflopButton.addEventListener('mousedown', flipflop);

// dithering - fill color each even pixel as chess board
function dithering(event) {
  if (currentTool() !== 'dithering' || !isDrawing) return;
  const prevColor = document.querySelector('.prev-color');
  let square = boxSize();
  const x = Math.floor(event.offsetX / scale());
  const y = Math.floor(event.offsetY / scale());
  if (event.ctrlKey) {
      for(let x1 = x; x1 < x + square; x1++) {
        for(let y1 = y; y1 < y + square; y1++) {
          if(x1 % 2 !== y1 % 2) {
            ctx.fillStyle = currentColor();
            ctx.fillRect(x1, y1, 1, 1);
          } else {
            ctx.fillStyle = prevColor.value;
            ctx.fillRect(x1, y1, 1, 1);
          }
        }
      }
  } else {
      for(let x1 = x; x1 < x + square; x1++) {
        for(let y1 = y; y1 < y + square; y1++) {
          if(x1 % 2 !== y1 % 2) {
            ctx.fillStyle = currentColor();
            ctx.fillRect(x1, y1, 1, 1);
          } else {
            ctx.clearRect(x1, y1, 1, 1);
          }
        }
      }
  }
}

// helper for function lighten
// https://gist.github.com/mjackson/5311256
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [ h * 360, s * 100, l * 100 ];
}

// lighten - set color lighter or darker
function lighten(event) {
  if (currentTool() !== 'lighten' || !isDrawing) return;
  let square = boxSize();

  for(let x2 = x1; x2 < x1 + square; x2++) {
    for(let y2 = y1; y2 < y1 + square; y2++) {
      let pixel = ctx.getImageData(x2, y2, 1, 1);
      let data = pixel.data;

      // if color transparent
      if (data[3] === 0) return;
      let [h, s, l] = rgbToHsl(data[0], data[1], data[2]);

      if (event.ctrlKey) {
        ctx.fillStyle = `hsl(${h}, ${s}%, ${l > 6 ? l -=5 : 1}%)`;

      } else {
        ctx.fillStyle = `hsl(${h}, ${s}%, ${l < 94 ? l +=5 : 99}%)`;
      }
      ctx.fillRect(x2, y2, 1, 1);
    }
  }
}

// color picker - get color of pixel on canvas
function colorPicker() {
  if (currentTool() !== 'color-picker' || !isDrawing) return;
  const x1 = Math.floor(event.offsetX / scale());
  const y1 = Math.floor(event.offsetY / scale());
  let pixel = ctx.getImageData(x1, y1, 1, 1);
  let data = pixel.data;
  // if color transparent
  if (data[3] === 0) return;
  let r = data[0].toString(16);
  r = r.length === 1 ? "0" + r : r;
  let g = data[1].toString(16);
  g = g.length === 1 ? "0" + g : g;
  let b = data[2].toString(16);
  b = b.length === 1 ? "0" + b : b;
  let hex = `#${r}${g}${b}`;
  activeColor.value = hex;
}

// key activation tools
function hotKey(event) {
  const tools = document.querySelector('.tools');
  const hotkeyValues = document.querySelectorAll('.hotkey-value');
  const hotkeyNames = document.querySelectorAll('.hotkey-name');
  for(let i = 0; i < hotkeyValues.length; i++) {
    if (event.code === `Key${hotkeyValues[i].innerText}`) {
    tools.querySelector(`input[value=${hotkeyNames[i].innerText}]`).checked = true;
    }
  }
}

// modal window to change keyboard shortcuts
const changeHotkeys = document.querySelector('.change-hotkeys');
const hotkeyOpen = document.querySelector('.change-hotkey');
const hotkeyClose = document.querySelector('.cancel');

function changeShortcuts(event) {
  if(!event.target.classList.contains('hotkey-input')) return;

  const inform = document.querySelector('.inform');
  const btnHotkey = document.querySelector('.btn-hotkey');
  const hotkeyValues = document.querySelectorAll('.hotkey-value');
  const hotkeyValuesArr = [];
  hotkeyValues.forEach(hotkey => hotkeyValuesArr.push(hotkey.innerText));

  event.target.addEventListener('input', () => {
    let changeValue = event.target.value;
    if (!changeValue.match(/[a-zA-Z]/)) {
      inform.innerText = "Please use only Latin letters";
    }
    if (changeValue.match(/[a-z]/)) {
      changeValue = changeValue.toUpperCase();
    }
    if (hotkeyValuesArr.includes(changeValue)) {
      inform.innerText = "This letter already in use. Please choose another letter";
    } else if(changeValue.match(/[A-Z]/)) {
      inform.innerText = "Press the button to change the hotkey";
    }
    btnHotkey.addEventListener('click', () => {
      event.target.previousElementSibling.innerText = changeValue;
      event.target.value = '';
      inform.innerText = "The hotkey is changed successfully";

      const tooltipShortcuts = document.querySelectorAll('.tooltip-shortcut');
      tooltipShortcuts.forEach(tooltip => {
        if(tooltip.dataset.tool === event.target.previousElementSibling.previousElementSibling.innerText) {
          tooltip.innerText = `(${changeValue})`;
        }
      })
    });
  });
}

changeHotkeys.addEventListener('click', changeShortcuts);
hotkeyOpen.addEventListener('click', () => {
  changeHotkeys.classList.remove('hide');
});
hotkeyClose.addEventListener('click', () => {
  changeHotkeys.classList.add('hide');
});

window.addEventListener('keydown', hotKey);

// show and hide modal window with settings on layout
function showSettings(event) {
  const settings = document.querySelectorAll('.setting-container');
  const buttons = document.querySelectorAll('.setting-btn');
  const parent = event.target.parentNode;

  if (!event.target.classList.contains('btn-show')) {
    buttons.forEach(button => {
      button.classList.remove('btn-show');
    });
    event.target.classList.add('btn-show')
  }

  if(parent.classList.contains('setting-hide')) {
    settings.forEach(setting => {
      setting.classList.remove('setting-hide');
    });
    if (!parent.classList.contains('setting-show')) {
      settings.forEach(setting => {
        setting.classList.remove('setting-show');
        setting.lastElementChild.classList.remove('setting-opacity');
        setting.lastElementChild.classList.add('setting-none');
        parent.classList.add('setting-show');
        parent.lastElementChild.classList.remove('setting-none');
        parent.lastElementChild.classList.add('setting-opacity');
      });
    }
  } else if (!parent.classList.contains('setting-show')) {
    settings.forEach(setting => {
      setting.classList.remove('setting-show');
      setting.lastElementChild.classList.remove('setting-opacity');
      setting.lastElementChild.classList.add('setting-none');
      parent.classList.add('setting-show');
      parent.lastElementChild.classList.remove('setting-none');
      parent.lastElementChild.classList.add('setting-opacity');
    });
  } else {
    settings.forEach(setting => {
      setting.classList.add('setting-hide');
    });
  }
}

const settingResizeBtn = document.querySelector('.setting-resize-btn');
const settingSaveBtn = document.querySelector('.setting-save-btn');
const settingImportBtn = document.querySelector('.setting-import-btn');

settingResizeBtn.addEventListener('click', showSettings);
settingSaveBtn.addEventListener('click', showSettings);
settingImportBtn.addEventListener('click', showSettings);

// canvas zoom in and zoom out on mousewheel
function mouseWheelHandler(e) {
  e = window.event;
  let delta = Math.max(-1, Math.min(1, e.wheelDelta));
  canvas.style.width = Math.max(32, Math.min(640, canvas.offsetWidth + (32 * delta))) + "px";
  canvas.style.height = Math.max(32, Math.min(640, canvas.offsetHeight + (32 * delta))) + "px";
  return false;
}

const mainContainer = document.querySelector('.main-container');
mainContainer.addEventListener('mousewheel', mouseWheelHandler);
canvas.addEventListener('mousewheel', mouseWheelHandler);

canvas.addEventListener('mousemove', pen);
canvas.addEventListener('mousedown', mirror);
canvas.addEventListener('mousemove', mirror);
canvas.addEventListener('mousedown', bucket);
canvas.addEventListener('mousedown', eraser);
canvas.addEventListener('mousemove', eraser);
canvas.addEventListener('mousedown', brush);
canvas.addEventListener('mousemove', stroke);
canvas.addEventListener('mousemove', circle);
canvas.addEventListener('mousemove', rectangle);
canvas.addEventListener('mousemove', move);
canvas.addEventListener('mousemove', shape);
canvas.addEventListener('mousedown', shape);
canvas.addEventListener('mousedown', colorPicker);
canvas.addEventListener('mousedown', lighten);
canvas.addEventListener('mousemove', dithering);

// add numbers to frames
function frameNumber() {
  const frames = document.querySelectorAll('.preview');
  frames.forEach((frame, index) => {
    const frameNumber = frame.querySelector('.number');
    frameNumber.innerText = index + 1;
  });
}

// add style to active frame
function frameStyle() {
  const frames = document.querySelectorAll('.preview');
  frames.forEach((frame, index) => {
    frame.classList.remove('preview-active');
    if (index === frames.length - 1) {
      frame.classList.add('preview-active');
    }
  });
}

// add canvas image to active frame when mouse up
function frameCreate() {
  const frames = document.querySelectorAll('.preview');
  frames.forEach((frame) => {
    if (frame.classList.contains('preview-active')) {
      const canvas2 = frame.querySelector('.canvas2');
      const ctx2 = canvas2.getContext('2d');
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      ctx2.drawImage(canvas, 0, 0);
    }
  });
}

canvas.addEventListener('mouseup', frameCreate);

// style active frame on click
function frameActivation(event) {
  if (event.target.classList.contains('canvas2')) {
    const frames = document.querySelectorAll('.preview');
    frames.forEach((frame) => {
      if (frame.classList.contains('preview-active')) {
        frame.classList.remove('preview-active');
      }
    });
    event.target.parentNode.classList.add('preview-active');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(event.target, 0, 0);
  }
}

const parent = document.querySelector('.previews-list');
parent.addEventListener("click", frameActivation);

// create new frame when click button Add frames
function addFrame() {
  const elem = parent.querySelector('.preview-container');
  const clone = elem.cloneNode(true);
  parent.appendChild(clone);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frameNumber();
  frameStyle();
}

const addFrameButton = document.querySelector('.add-frame');
addFrameButton.addEventListener("click", addFrame);

// delete frame when click button delete
function deleteFrame(event) {
  if (event.target.classList.contains('delete') && parent.children.length > 1) {
    if(event.target.parentNode.classList.contains('preview-active')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    event.target.parentNode.parentNode.remove();
    frameNumber();
    animationBackground();
    frameStyle();
  }
}

parent.addEventListener("click", deleteFrame);

// move frame and swape with other frames
function moveFrame(event) {
  if (!event.target.classList.contains('move')) return;
  let t = event.target.parentNode;
  event.target.onmousedown = function () {
    t.style.position = "absolute";
    t.style.zIndex = 100;
    t.parentNode.classList.add('preview-container-active');

    function moveAt(event) {
      t.style.top = event.pageY - t.offsetHeight / 2 - t.parentNode.offsetTop + 'px';
      t.style.left = '-3px'
    }
    document.onmousemove = function (event) {
      moveAt(event);
    }
  }
  t.onmouseup = function () {
    const blockContainer = document.querySelectorAll('.preview-container');
    blockContainer.forEach(item => {
      let y = t.offsetTop + t.parentNode.offsetTop;
      let y1 = item.offsetTop;

      if(y > parent.offsetHeight) {
        t.parentNode.appendChild(t);
        t.style.top = '0px';
        t.style.left = '0px'
      }

      if (y > y1 - 50 && y < y1 + 50) {
        let parent1 = item;
        let child1 = item.firstElementChild;
        let parent0 = t.parentNode;
        let child0 = t;
        t.style.top = '0px';
        t.style.left = '0px'

        parent1.appendChild(child0);
        parent0.appendChild(child1);

        parent0.classList.remove('preview-container-active');
      } else {
        t.parentNode.appendChild(t);
        t.parentNode.classList.remove('preview-container-active');
      }
    });
    t.style.zIndex = 1;

    document.onmousemove = null;
    t.onmouseup = null;

    frameNumber();
    animationBackground();
    frameStyle();
  }
}

parent.addEventListener("mouseover", moveFrame);

// clone frame when click button clone
function cloneFrame(event) {
  if (event.target.classList.contains('copy')) {
    const clone = event.target.parentNode.parentNode.cloneNode(true);
    const parentNode = event.target.parentNode.parentNode;
    const canvasParentNode = event.target.parentNode.querySelector('canvas');
    const canvasCloneElem = clone.querySelector('canvas');
    const ctxCloneElem = canvasCloneElem.getContext('2d');
    ctxCloneElem.drawImage(canvasParentNode, 0, 0);
    parent.insertBefore(clone, parentNode);
    frameNumber();
    animationBackground();
    frameStyle();
  }
}
parent.addEventListener("click", cloneFrame);

const layer = document.querySelector('.layer');

// layer management
const layerManagementContainer = document.querySelector('.layer-management-layer-container');

// create new layers when click add layer
function createLayer() {
  const addLayer = document.createElement('div');
  addLayer.classList.add('layer-management-layer');
  addLayer.innerText = 'Layer ';
  addLayer.dataset.layernum = layerManagementContainer.children.length + 1;
  const span = document.createElement('span');
  span.innerText = `${layerManagementContainer.children.length
 + 1}`;
  addLayer.appendChild(span);

  layerManagementContainer.insertBefore(addLayer, layerManagementContainer.firstChild);
}

// active layer style for layer which create last
function styleActiveLayer() {
  const layerManagementLayers = document.querySelectorAll('.layer-management-layer');
  layerManagementLayers.forEach(layer => {
    if (layer.classList.contains('layer-management-layer-active')) {
      layer.classList.remove('layer-management-layer-active');
    }
  });
  layerManagementContainer.firstElementChild.classList.add('layer-management-layer-active');
}

// active layer style for clicking layer
function styleActiveClickedLayer(event) {
  const layerManagementLayers = document.querySelectorAll('.layer-management-layer');
  layerManagementLayers.forEach(layer => {
    if (layer.classList.contains('layer-management-layer-active')) {
      layer.classList.remove('layer-management-layer-active');
    }
    event.target.classList.add('layer-management-layer-active');
  })
}

layerManagementContainer.addEventListener('click', styleActiveClickedLayer);

// create additional canvas for semitransparent image
function createCanvasTemp() {
  const canvasTemp = document.createElement('canvas');
  canvasTemp.width = canvasTemp.height = canvas.width;
  canvasTemp.classList.add('canvas-temp');
  canvasTemp.dataset.canvastempnum = layerManagementContainer.children.length - 1;
  const mainContainer = document.querySelector('.main-container');
  mainContainer.appendChild(canvasTemp);

  const ctxTemp = canvasTemp.getContext('2d');
  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctxTemp.putImageData(myImageData, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL();
  localStorage.setItem('url', url);
}

function layerPlus() {
  createLayer();
  styleActiveLayer();
  createCanvasTemp();
}

// active layer drav image on canvas for clicking layer
function drawImageActiveClickingLayer() {
  const layerActive = document.querySelector('.layer-management-layer-active');
  const layerActiveNum = layerActive.dataset.layernum;
  const canvasTempAll = document.querySelectorAll('.canvas-temp');
  isCanvasTemp = false;
  canvasTempAll.forEach(canvasTemp => {
    if(canvasTemp.dataset.canvastempnum == layerManagementContainer.children.length) {
      isCanvasTemp = true;
    }
  });
  if(!isCanvasTemp) {
    const canvasTemp = document.createElement('canvas');
    canvasTemp.width = canvasTemp.height = canvas.width;
    canvasTemp.classList.add('canvas-temp');
    canvasTemp.dataset.canvastempnum = layerManagementContainer.children.length;
    const mainContainer = document.querySelector('.main-container');
    mainContainer.appendChild(canvasTemp);

    const ctxTemp = canvasTemp.getContext('2d');
    const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctxTemp.putImageData(myImageData, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL();
    localStorage.setItem('url', url);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasTempAll.forEach(canvasTemp => {
    if(canvasTemp.dataset.canvastempnum == layerActiveNum) {
      ctx.drawImage(canvasTemp, 0, 0);
    }
  });
}

layerManagementContainer.addEventListener('click', drawImageActiveClickingLayer);

// canvas drav image on active layer
function drawImageOnCanvasTemp() {
  const layerActive = document.querySelector('.layer-management-layer-active');
  const layerActiveNum = layerActive.dataset.layernum;
  const layersLength = layerManagementContainer.children.length;
  const canvasTempAll = document.querySelectorAll('.canvas-temp');
  if(layerActiveNum == layersLength) return;
  canvasTempAll.forEach(canvasTemp => {
    if(canvasTemp.dataset.canvastempnum == layerActiveNum) {
      const ctxTemp = canvasTemp.getContext('2d');
      const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctxTemp.putImageData(myImageData, 0, 0);
    }
  });
}

canvas.addEventListener('mouseup', drawImageOnCanvasTemp);

function removeCanvasTemp() {
  drawImageActiveClickingLayer();
  const layerActive = document.querySelector('.layer-management-layer-active');
  const layersLength = layerManagementContainer.children.length;
  const layerActiveNum = layerActive.dataset.layernum;
  const canvasTempAll = document.querySelectorAll('.canvas-temp');
  if(layersLength === 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL();
    localStorage.setItem('url', url);
    layerActive.firstElementChild.innerText = '1';
    layerActive.dataset.layernum = '1';
    canvasTempAll.forEach(canvas2 => canvas2.remove());
    frameCreate();
    animationBackground();
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  layerActive.remove();
    canvasTempAll.forEach(canvas2 => {
      if(canvas2.dataset.canvastempnum == layerActiveNum) {
        canvas2.remove();
      }
    });
  styleActiveLayer();
  drawImageActiveClickingLayer();
}

function canvasTempToFrame() {
  const activeFrame = document.querySelector('.preview-active');
  const currentFrame = activeFrame.parentNode.previousElementSibling;
  const canvas2 = currentFrame.querySelector('.canvas2');
  const ctxFrame = canvas2.getContext('2d');
  const canvasTemp = document.querySelectorAll('.canvas-temp');
  for(let i = 0; i < canvasTemp.length; i++) {
    ctxFrame.drawImage(canvasTemp[i], 0, 0);
    canvasTemp[i].remove();
  }
  const url = canvas2 .toDataURL();
  localStorage.setItem('url', url);
  while (layerManagementContainer.children.length > 1) {
    layerManagementContainer.removeChild(layerManagementContainer.firstChild);
  }
  layerManagementContainer.firstElementChild.firstElementChild.innerText = '1';
  styleActiveLayer();
}

addFrameButton.addEventListener("click", () => {
  canvasTempToFrame();
  removeCanvasTemp();
  styleActiveLayer();
});

// up layer when click btn-up
function layerUp() {
  const layerActive = document.querySelector('.layer-management-layer-active');
  const layersLength = layerManagementContainer.children.length;
  const layerActiveNum = layerActive.dataset.layernum;
  const mainContainer = document.querySelector('.main-container');
  const canvasTempAll = document.querySelectorAll('.canvas-temp');
  if(layerActive === layerManagementContainer.firstElementChild) return;

  const prevLayer = layerActive.previousElementSibling;
  layerManagementContainer.removeChild(layerActive);
  layerManagementContainer.insertBefore(layerActive, prevLayer);

  canvasTempAll.forEach(canvasTemp => {
    if(canvasTemp.dataset.canvastempnum == layerActiveNum) {
      const prevCanvasTemp = canvasTemp.previousElementSibling;
      mainContainer.removeChild(canvasTemp);
      mainContainer.insertBefore(canvasTemp, prevCanvasTemp);
    }
  });
  drawImageActiveClickingLayer();
}

// down layer when click btn-down
function layerDown() {
  const layerActive = document.querySelector('.layer-management-layer-active');
  const layersLength = layerManagementContainer.children.length;
  const layerActiveNum = layerActive.dataset.layernum;
  const mainContainer = document.querySelector('.main-container');
  const canvasTempAll = document.querySelectorAll('.canvas-temp');
  if(layerActive === layerManagementContainer.lastElementChild) return;

  const nextLayer = layerActive.nextElementSibling;
  layerManagementContainer.removeChild(nextLayer);
  layerManagementContainer.insertBefore(nextLayer, layerActive);

  canvasTempAll.forEach(canvasTemp => {
    if(canvasTemp.dataset.canvastempnum == layerActiveNum) {
      const nextCanvasTemp = canvasTemp.nextElementSibling;
      mainContainer.removeChild(nextCanvasTemp);
      mainContainer.insertBefore(nextCanvasTemp, canvasTemp);
    }
  });
  drawImageActiveClickingLayer();
}

function layerManagementBtnDelegation(event) {
  event.stopPropagation();
  if (!event.target.classList.contains('layer-management-btn')) return;
  if (event.target.classList.contains('btn-plus')) {
    layerPlus();
  } else if (event.target.classList.contains('btn-delete')) {
    removeCanvasTemp();
  } else if (event.target.classList.contains('btn-up')) {
    layerUp()
  } else if (event.target.classList.contains('btn-down')) {
    layerDown();
  }
}

const layerManagementBtn = document.querySelector('.layer-management-btn-container');
layerManagementBtn.addEventListener('click', layerManagementBtnDelegation);

// change text on input range
function valueFPS() {
  const fpsValue = document.querySelector('.fps-value');
  fpsValue.innerText = rangeFPS.value;
}

const rangeFPS = document.querySelector('.range-fps');
rangeFPS.addEventListener("input", valueFPS);

// run the animation in Full screen mode
function toggleFullscreen() {
  const layerWrapper = document.querySelector('.layer-wrapper');
  if (!document.fullscreenElement) {
    layerWrapper.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

const layerBtn = document.querySelector('.layer-btn');
layerBtn.addEventListener('click', toggleFullscreen);

// animation layer background image
let indexImage = 0;
let timer;

// define speed of animation layer background image
function animationSpeed() {
  if(rangeFPS.value == 0) return;
  let speed = 1000 / rangeFPS.value;
  return speed;
}

function animationBackground() {
  let speed = animationSpeed();
  const framesCanvas = document.querySelectorAll('.canvas2');
  const ctxLayer = layer.getContext('2d');
  ctxLayer.clearRect(0, 0, layer.width, layer.height);
  ctxLayer.drawImage(framesCanvas[indexImage = ++indexImage % framesCanvas.length], 0, 0);
  const canvasTemp = document.querySelectorAll('.canvas-temp');
  for(let i = 0; i < canvasTemp.length; i++) {
    ctxLayer.drawImage(canvasTemp[i], 0, 0);
  }
  if (timer) {
    clearInterval(timer);
  }
  timer = setTimeout(animationBackground, speed);
  if(rangeFPS.value == 0) {
    clearInterval(timer);
  }
}

canvas.addEventListener('mouseup', animationBackground);
rangeFPS.addEventListener("input", animationBackground);

// save image
// change text on input range
const rangeSize = document.querySelector('.range-size');

function valueImageSize() {
  const sizeValue = document.querySelector('.size-value');
  sizeValue.innerText = rangeSize.value;
  return rangeSize.value;
}

rangeSize.addEventListener("input", valueImageSize);

// save image as gif
// https://github.com/yahoo/gifshot
// https://github.com/rndme/download
function framesToImages() {
  const canvas2All = document.querySelectorAll('.canvas2');
  const images = [];
  canvas2All.forEach(canvas2 => {
    const canvasIn = document.createElement('canvas');
    const ctxIn = canvasIn.getContext('2d');

    const size = valueImageSize();
    canvasIn.width = size;
    canvasIn.height = size;
    ctxIn.fillStyle = 'rgba(225,225,225,0.1)';
    ctxIn.fillRect(0, 0, canvasIn.width, canvasIn.height);
    ctxIn.imageSmoothingEnabled = false;
    ctxIn.drawImage(canvas2, 0, 0, size, size);
    images.push(canvasIn.toDataURL());
  });
  return images;
}

const saveGif = document.querySelector('.save-gif');
saveGif.addEventListener('click', () => {
  gifshot.createGIF({
    images: framesToImages(),
    interval: 1 / rangeFPS.value,
    gifWidth: valueImageSize(),
    gifHeight: valueImageSize(),
  }, (obj) => {
    if (!obj.error) {
      const image = obj.image;
      download(image, 'newGif.gif', 'gif');
    }
  });
});

// save image as apng
// https://github.com/photopea/UPNG.js
function ArrayBufferData() {
  const data = [];
  const canvas2All = document.querySelectorAll('.canvas2');

  canvas2All.forEach(canvas2 => {
    const ctx = canvas2.getContext('2d');
    const canvasIn = document.createElement('canvas');
    const ctxIn = canvasIn.getContext('2d');

    const size = valueImageSize();
    canvasIn.width = size;
    canvasIn.height = size;

    ctxIn.imageSmoothingEnabled = false;
    ctxIn.drawImage(canvas2, 0, 0, size, size);
    const partData = ctxIn.getImageData(0, 0, size, size).data.buffer;
    data.push(partData);
  });
  return data;
}

function saveImageAsApng() {
  const arrAnimationSpeed = new Array(ArrayBufferData().length);
  arrAnimationSpeed.fill(animationSpeed());
  const imageData = UPNG.encode(ArrayBufferData(), valueImageSize(), valueImageSize(), 0, arrAnimationSpeed);
  download(imageData, 'newAPNG.apng', 'apng');
}

const saveApng = document.querySelector('.save-apng');
saveApng.addEventListener('click', saveImageAsApng);

// save image as own format pixel
function saveImageAsPixel() {
  const fps = rangeFPS.value;
  const size = canvas.width;
  const frameCount = framesToImages().length;
  const canvasUrl = canvas.toDataURL();
  const canvas2All = document.querySelectorAll('.canvas2');
  let images = "";
  for(let i = 0; i < frameCount; i++) {
      const framesUrl = canvas2All[i].toDataURL();
      images += `${framesUrl}, `;
    }
  const pixel = `${fps}, ${size}, ${frameCount}, ${canvasUrl}, ${images}`;
  download(pixel, 'newPixel.pixel', 'pixel');
}
const savePixel = document.querySelector('.save-pixel');
savePixel.addEventListener('click', saveImageAsPixel);

// open local file pixel from computer
// http://qaru.site/questions/57624/how-to-open-a-local-disk-file-with-javascript
function readSingleFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    const contents = event.target.result;
    importPixel(contents);
  };
  reader.readAsText(file);
}

const importPixelBtn = document.querySelector('.import-pixel');
importPixelBtn.addEventListener('change', readSingleFile, false);

// restore the state of elements from a pixel file
function importPixel(contents) {
  const pixelArr = contents.split(', ');
  const saveFps = pixelArr[0];
  const saveSize = pixelArr[1];
  const saveFrameCount = pixelArr[2];
  const saveCanvasUrl = pixelArr[3];

  rangeFPS.value = saveFps;
  const fpsValue = document.querySelector('.fps-value');
  fpsValue.innerText = saveFps;

  canvas.width = canvas.height = saveSize;
  canvas2.width = canvas2.height = saveSize;
  layer.width = layer.height = saveSize;
  const resizeInput = document.getElementsByName('resize');
  resizeInput.forEach(input => {
    input.checked = false;
    if(input.value == saveSize) {
      input.checked = true;
    }
  });

  const saveCanvasImage = new Image();
  saveCanvasImage.src = saveCanvasUrl;
  saveCanvasImage.onload = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(saveCanvasImage, 0, 0, canvas.width, canvas.height);
    frameCreate();
    animationBackground();
  }

  if(saveFrameCount > 1) {
    const framesParent = document.querySelector('.previews-list');

    for(let i = 0; i < saveFrameCount-1; i++) {
      const canvas2 = framesParent.lastElementChild.firstElementChild.firstElementChild;
      const ctx2 = canvas2.getContext('2d');
      const framesImage = new Image();
      framesImage.src = pixelArr[4 + i];
      framesImage.onload = function() {
        ctx2.drawImage(framesImage, 0, 0);
      }
      addFrame();
    }
  }
}

// import image from computer
function importImage(event) {
  const image = event.target.files[0];
  if (!image) return;
  const readerImage = new FileReader();
  readerImage.onload = function(event) {
    const loadImageUrl = event.target.result;
    var loadImage = new Image();
    loadImage.src = loadImageUrl;
    loadImage.onload = function() {
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
	  ctx.drawImage(loadImage, 0, 0, canvas.width, canvas.height);
      frameCreate();
      animationBackground();
    };
  };
  readerImage.readAsDataURL(image);
}

const importImageBtn = document.querySelector('.import-image');
importImageBtn.addEventListener('change', importImage, false);

// save image as png
function saveImageAsPng() {
  const canvas2All = document.querySelectorAll('.canvas2');
  const canvasIn = document.createElement('canvas');
    const ctxIn = canvasIn.getContext('2d');

    const size = valueImageSize();
    canvasIn.width = size;
    canvasIn.height = size;

    ctxIn.imageSmoothingEnabled = false;

  canvas2All.forEach(canvas2 => {
    ctxIn.drawImage(canvas2, 0, 0, size, size);
  });
  const image = canvasIn.toDataURL();
  download(image, 'newPng.png', 'png');
}

const savePng = document.querySelector('.save-png');
savePng.addEventListener('click', saveImageAsPng);

// upload image to Google Drive
const saveToGoogleDrive = (fileContent) => {
  const arrAnimationSpeed = new Array(ArrayBufferData().length);
  arrAnimationSpeed.fill(animationSpeed());
  const imageData = UPNG.encode(ArrayBufferData(), valueImageSize(), valueImageSize(), 0, arrAnimationSpeed);

  var file = new Blob([imageData], { type: 'image/apng' });
  var metadata = {
    'name': 'newPiskel.apng',
    'mimeType': 'apng',
  };
  var accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  var form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);
  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    name: 'piskel.jpg',
    method: 'POST',
    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
    body: form,
  });
}

const btnSaveGoogle = document.querySelector('.save-google-drive');
btnSaveGoogle.addEventListener('click', saveToGoogleDrive);

// save the state of elements in LocalStorage
const tool = document.getElementsByName('tool');
for (let i = 0; i < tool.length; i++) {
  tool[i].onclick = function() {
    localStorage.setItem('radioTool', this.value);
  }
}

const resize = document.getElementsByName('resize');
for (let i = 0; i < resize.length; i++) {
  resize[i].onclick = function() {
    localStorage.setItem('radioResize', this.value);
  }
}

activeColor.onchange = function() {
    localStorage.setItem('activeColor', activeColor.value);
  }
prevColor.onchange = function() {
    localStorage.setItem('prevColor', prevColor.value);
  }

canvas.onclick = function() {
  const url = canvas.toDataURL();
  localStorage.setItem('url', url);
}

function saveFrames() {
  const canvas2All = document.querySelectorAll('.canvas2');
  const framesLength = canvas2All.length;
  localStorage.setItem('framesLength', framesLength);

  for(let i = 0; i < framesLength; i++) {
      const framesUrl = canvas2All[i].toDataURL();
      localStorage.setItem(i, framesUrl);
    }
}

addFrameButton.addEventListener("click", saveFrames);
parent.addEventListener("click", saveFrames);

// restore the state of elements after a reboot
window.onload = function() {
  if(localStorage.getItem('radioTool')) {
    const radioTool = localStorage.getItem('radioTool');
    document.querySelector('input[name="tool"][value="' + radioTool + '"]').setAttribute('checked','checked');
  }

  if(localStorage.getItem('radioResize')) {
    const radioResize = localStorage.getItem('radioResize');
    document.querySelector('input[name="resize"][value="' + radioResize + '"]').setAttribute('checked','checked');
    setSizeCanvas();
  }

  if(localStorage.getItem('activeColor')) {
    activeColor.value = localStorage.getItem('activeColor');
  }
  if(localStorage.getItem('prevColor')) {
    prevColor.value = localStorage.getItem('prevColor');
  }

  if(localStorage.getItem('url')) {
    const savedImage = new Image();
    savedImage.src = localStorage.getItem('url');
    savedImage.onload = function() {
      ctx.drawImage(savedImage, 0, 0);
      frameCreate();
      animationBackground();
    }
  }

    if(localStorage.getItem('framesLength')) {
    const framesLength = localStorage.getItem('framesLength');
    const framesParent = document.querySelector('.previews-list');

    for(let i = 0; i < framesLength-1; i++) {
      const canvas2 = framesParent.lastElementChild.firstElementChild.firstElementChild;
      const ctx2 = canvas2.getContext('2d');
      const framesImage = new Image();
      framesImage.src = localStorage.getItem(i);
      framesImage.onload = function() {
        ctx2.drawImage(framesImage, 0, 0);
      }
      addFrame();
    }
  }
}

// clear localStorage
const btnCreate = document.querySelector('.btn-create');
btnCreate.onclick = function() {
  localStorage.clear();
}

const newPiskel = document.querySelector('.name');
newPiskel.onclick = function() {
  localStorage.clear();
  while (parent.children.length > 1) {
    parent.removeChild(parent.lastChild);     
  }
  parent.firstElementChild.firstElementChild.classList.add('preview-active');
  const canvas2 = document.querySelector('.canvas2');
  const ctx2 = canvas2.getContext('2d');
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const ctxLayer = layer.getContext('2d');
  ctxLayer.clearRect(0, 0, layer.width, layer.height);
  activeColor.value = '#006060';
  prevColor.value = '#ffd700';
}

// restore the state of elements from a piskel file
function readPiskelFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    const contents = event.target.result;
    importDataFromPiskel(contents);
  };
  reader.readAsText(file);
}

function importDataFromPiskel(contents) {
  const fps = contents.split('fps":').pop().split(',')[0];
  const size = contents.split('height":').pop().split(',')[0];
  const frameCount = contents.split('frameCount\\":').pop().split(',')[0];
  const imageUrl = contents.split('base64PNG\\":\\"').pop().split('\\"')[0];

  rangeFPS.value = fps;
  const fpsValue = document.querySelector('.fps-value');
  fpsValue.innerText = fps;

  canvas.width = canvas.height = size;
  canvas2.width = canvas2.height = size;
  layer.width = layer.height = size;
  const resizeInput = document.getElementsByName('resize');
  resizeInput.forEach(input => {
    input.checked = false;
    if(input.value == size) {
      input.checked = true;
    }
  });

  const saveCanvasImage = new Image();
  saveCanvasImage.src = imageUrl;
  saveCanvasImage.onload = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(saveCanvasImage, size * (frameCount - 1), 0, size, size, 0, 0, size, size);
    frameCreate();
    animationBackground();
  }

    if(frameCount > 1) {
    const framesParent = document.querySelector('.previews-list');

    for(let i = 0; i < frameCount-1; i++) {
      const canvas2 = framesParent.lastElementChild.firstElementChild.firstElementChild;
      const ctx2 = canvas2.getContext('2d');
      const framesImage = new Image();
      framesImage.src = imageUrl;
      framesImage.onload = function() {
        ctx2.drawImage(saveCanvasImage, size * i, 0, size, size, 0, 0, size, size);
      }
      addFrame();
    }
  }
}

const importPiskelBtn = document.querySelector('.import-piskel');
importPiskelBtn.addEventListener('change', readPiskelFile, false);

// save image as piskel
function saveImageAsPiskel() {
  const fps = rangeFPS.value;
  const height = canvas.height;
  const width = canvas.width;
  const frameCount = framesToImages().length;

  const canvas2All = document.querySelectorAll('.canvas2');

  const canvasIn = document.createElement('canvas');
  const ctxIn = canvasIn.getContext('2d');
  canvasIn.width = frameCount * width;
  canvasIn.height = height;

  canvas2All.forEach((canvas2, index) => {
    ctxIn.drawImage(canvas2, width * index, 0, width, height);
  });
  const images = canvasIn.toDataURL('image/png;base64');

  let layout = '';

  for(let i = 0; i < frameCount; i++) {
    layout += '[' + i + '],';
  }

  const piskel = `{"modelVersion":2,"piskel":{"name":"New Piskel","description":"","fps":${fps},"height":${height},"width":${width},"layers":["{\\"name\\":\\"Layer 1\\",\\"opacity\\":1,\\"frameCount\\":${frameCount},\\"chunks\\":[{\\"layout\\":[${layout.slice(0, -1)}],\\"base64PNG\\":\\"${images}\\"}]}"],"hiddenFrames":[]}}`
  download(piskel, 'newPiskel.piskel', 'piskel');
}

const savePiskel = document.querySelector('.savepiskel');
savePiskel.addEventListener('click', saveImageAsPiskel);
