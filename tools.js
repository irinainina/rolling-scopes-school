const canvas = document.querySelector('#canvas');
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
    ctx2 = canvas2.getContext('2d');
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

// get current color
function currentColor() {
  const activeColor = document.querySelector('.active-color');
  let activeColorValue = activeColor.value;
  return activeColorValue;
}

// change current and prev colors
function changeColor() {
  const activeColor = document.querySelector('.active-color');
  const prevColor = document.querySelector('.prev-color');
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

function square(event) {
  if (currentTool() !== 'square' || !isDrawing) return;
  ctx.putImageData(canvasCopy, 0, 0);
  let imageDataPrew = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let x2 = Math.floor(event.offsetX / scale());
  let y2 = Math.floor(event.offsetY / scale());

  let width = x2 - startLine.x || 1;
  let height = y2 - startLine.y || 1;

  ctx.fillStyle = 'rgba(79, 181, 227, .3)';
  ctx.fillRect(startLine.x, startLine.y, width, height);
  let imageData = ctx.getImageData(startLine.x, startLine.y, width, height);

  ctx.putImageData(imageData, x2, y2);
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

// rotation canvas
// http://qaru.site/questions/6704867/rotate-canvas-90-degrees-clockwise-and-update-width-height


function rotation(event) {
  myImageData = new Image();
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
  myImageData = new Image();
  myImageData.src = canvas.toDataURL();
  ctx.save();
  if(event.ctrlKey) {
    console.log('111');
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
  const activeColor = document.querySelector('.active-color');
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

canvas.addEventListener('mousemove', pen);
canvas.addEventListener('mousemove', mirror);
canvas.addEventListener('mousedown', bucket);
canvas.addEventListener('mousedown', eraser);
canvas.addEventListener('mousemove', eraser);
canvas.addEventListener('mousedown', brush);
canvas.addEventListener('mousemove', stroke);
canvas.addEventListener('mousemove', circle);
canvas.addEventListener('mousemove', rectangle);
canvas.addEventListener('mousemove', move);
canvas.addEventListener('mousedown', colorPicker);
canvas.addEventListener('mousedown', lighten);
canvas.addEventListener('mousemove', dithering);
