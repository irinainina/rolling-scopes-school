const activeColor = document.querySelector('.active-color');
const prevColor = document.querySelector('.prev-color');
const resizeInput = document.getElementsByName('resize');
const parent = document.querySelector('.previews-list');
const tools = document.querySelector('.tools');
const layer = document.querySelector('.layer');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
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
  let sizeCanvas;
  resizeInput.forEach(resize => {
    if (resize.checked) {
      sizeCanvas = resize.value;
    }
  });
  canvas.width = sizeCanvas;
  canvas.height = sizeCanvas;
  canvas2.width = sizeCanvas;
  canvas2.height = sizeCanvas;
  layer.height = sizeCanvas;
  layer.height = sizeCanvas;
  return sizeCanvas;
}

// show information about canvas size
function showCanvasSize() {
  const showSize = document.querySelector('.canvas-size span');
  let sizeCanvas = resizeCanvas();
  showSize.innerText = `[${sizeCanvas}x${sizeCanvas}]`;
}

resizeInput.forEach(input => input.addEventListener("click", resizeCanvas));
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
  let activeColorValue = activeColor.value;
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

// indicates boxSize and position mouse on canvas 
function indicateCursorPosition() { 
  const cursorPosition = document.querySelector('.cursor-position');
  cursorPosition.style.zIndex = '10';
  let size;
  if(currentTool() === 'bucket' || currentTool() === 'brush' || currentTool() === 'move' || currentTool() === 'color-picker') {
    size = 1;    
  } else {
    size = boxSize();
  }  
  cursorPosition.style.width = scale() * size + 'px';
  cursorPosition.style.height = scale() * size + 'px';
  cursorPosition.style.top = y1 * scale() + canvas.offsetTop + 'px';
  cursorPosition.style.left = x1 * scale() + canvas.offsetLeft + 'px';
  
  canvas.addEventListener('mousedown', () => {
    cursorPosition.style.zIndex = '-10';
  });
  
  canvas.addEventListener('mousemove', () => {
    cursorPosition.style.zIndex = '-10';
  });
  
  canvas.addEventListener('mouseleave', () => {
    cursorPosition.style.zIndex = '-10';
  });
  
  canvas.addEventListener('mouseup', () => {
    cursorPosition.style.zIndex = '10';
  });
}

canvas.addEventListener('mousemove', indicateCursorPosition);

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

// drawing with pen on the canvas
function pen(event) {
  if (currentTool() !== 'pen' || !isDrawing) return;
  indicateCursorPosition();
  ctx.fillStyle = currentColor();
  let size = boxSize();
  const x = Math.floor(event.offsetX / scale() / size) * size;
  const y = Math.floor(event.offsetY / scale() / size) * size;
  ctx.fillRect(x, y, size, size);
}

// drawing with mirror pen on the canvas
function mirror(event) {
  if (currentTool() !== 'mirror' || !isDrawing) return;
  indicateCursorPosition();
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
  ctx.fillStyle = currentColor();
  if (event.ctrlKey) {    
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    let rgbColor = hexToRgbA(currentColor());
    floodFill(ctx, x1, y1, rgbColor);
  }
}

// erasing canvas
function eraser(event) {
  if (currentTool() !== 'eraser' || !isDrawing) return;
  let size = boxSize();
  const x = Math.floor(event.offsetX / scale() / size) * size;
  const y = Math.floor(event.offsetY / scale() / size) * size;
  ctx.clearRect(x, y, size, size);
}


// paint all pixels of the same color
function brush(event) {
  if (currentTool() !== 'brush' || !isDrawing) return;
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

// drawing line 
// https://ru.wikipedia.org/wiki/Алгоритм_Брезенхэма
let canvasCopy = canvas;
const startLine = {};

canvas.addEventListener('mousedown', () => {
  canvasCopy = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let size = boxSize();
  startLine.x = x1;
  startLine.y = y1;
});

const drawLine = (x1, y1, x2, y2) => {
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

const stroke = (event) => {
  if (currentTool() !== 'stroke' || !isDrawing) return;
  ctx.putImageData(canvasCopy, 0, 0);
  const endLine = {};
  endLine.x = Math.floor(event.offsetX / scale() / boxSize()) * boxSize();
  endLine.y = Math.floor(event.offsetY / scale() / boxSize()) * boxSize();
  if (event.shiftKey) {
    if(Math.abs(startLine.x - endLine.x) < Math.abs(startLine.y - endLine.y)) {
      endLine.x = startLine.x;
    } else {
      endLine.y = startLine.y;
    }
  } 
  drawLine(startLine.x, startLine.y, endLine.x, endLine.y);
}

// drawing rectangle
function rectangle(event) {
  if (currentTool() !== 'rectangle' || !isDrawing) return;
  ctx.putImageData(canvasCopy, 0, 0);
  ctx.lineWidth = boxSize();
  ctx.strokeStyle = currentColor();
  x2 = Math.floor(event.offsetX / scale());
  y2 = Math.floor(event.offsetY / scale());
  
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

// move canvas - not good work
function move(event) {
  if (currentTool() !== 'move' || !isDrawing) return;
  let deltax = x1 - startLine.x;
  let deltay = y1 - startLine.y;
  let imageData = ctx.getImageData(0, 0, canvas.width-deltax/32, canvas.height - deltay/32);
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imageData, deltax, deltay);
}

// color picker - get color of pixel on canvas
function colorPicker(event) {
  if (currentTool() !== 'color-picker' || !isDrawing) return;
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
  const x = Math.floor(event.offsetX / scale());
  const y = Math.floor(event.offsetY / scale()); 

  for(let x1 = x; x1 < x + square; x1++) {
    for(let y1 = y; y1 < y + square; y1++) {
      let pixel = ctx.getImageData(x1, y1, 1, 1);
      let data = pixel.data;
      // if color transparent
      if (data[3] === 0) return; 
      let [h, s, l] = rgbToHsl(data[0], data[1], data[2]);
      if (event.ctrlKey) {
        ctx.fillStyle = `hsl(${h}, ${s}%, ${l > 6 ? l -=5 : 1}%)`;
      } else {
        ctx.fillStyle = `hsl(${h}, ${s}%, ${l < 94 ? l +=5 : 99}%)`;
      }   
      ctx.fillRect(x1, y1, 1, 1);
    }
  }
}

// dithering - fill color each even pixel as chess board
function dithering(event) {
  if (currentTool() !== 'dithering' || !isDrawing) return;
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

// key activation tools
function hotKey(event) {
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
canvas.addEventListener('mousemove', eraser);
canvas.addEventListener('mousedown', brush);
canvas.addEventListener('mousemove', stroke);
canvas.addEventListener('mousemove', circle);
canvas.addEventListener('mousemove', rectangle);
canvas.addEventListener('mousemove', move);
canvas.addEventListener('mousedown', colorPicker);
canvas.addEventListener('mousedown', lighten);
canvas.addEventListener('mousemove', dithering);

// FRAMES

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
  frames.forEach((frame, index) => {
    if (frame.classList.contains('preview-active')) {
      const canvas2 = frame.querySelector('.canvas2');
      const ctx2 = canvas2.getContext('2d');
      ctx2.drawImage(canvas, 0, 0);
    }
  });
}

canvas.addEventListener('mouseup', frameCreate);

// style active frame on click
function frameActivation(event) {
  if (event.target.classList.contains('canvas2')) {
    const frames = document.querySelectorAll('.preview');
    frames.forEach((frame, index) => {
      if (frame.classList.contains('preview-active')) {
        frame.classList.remove('preview-active');
      }
    });
    event.target.parentNode.classList.add('preview-active');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(event.target, 0, 0);
  }
}

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
  event.target.onmousedown = function(event) {
    t.style.position = "absolute";
    t.style.zIndex = 100;
    t.parentNode.classList.add('preview-container-active');

    function moveAt(event) {
      t.style.top = event.pageY - t.offsetHeight / 2 - t.parentNode.offsetTop + 'px';
      t.style.left = '-3px'
    }
    document.onmousemove = function(event) {
      moveAt(event);
    }
  }
  t.onmouseup = function(event) {
    const blockContainer = document.querySelectorAll('.preview-container');
    blockContainer.forEach(item => {
      let y = t.offsetTop + t.parentNode.offsetTop;
      let y1 = item.offsetTop;
      if (y > y1 - 45 && y < y1 + 45) {
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

// LAYER
const layerBtn = document.querySelector('.layer-btn');
const rangeFPS = document.querySelector('.range-fps');

// change text on input range
function valueFPS() {
  const fpsValue = document.querySelector('.fps-value');
  fpsValue.innerText = rangeFPS.value;
}

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

layerBtn.addEventListener('click', toggleFullscreen);

// animation layer background image
let indexImage = 0;
let timer;

// define speed of animation layer background image 
function animationSpeed() {
  let speed = 1000 / rangeFPS.value;
  return speed;
}

function animationBackground() {
  let speed = animationSpeed();
  const framesCanvas = document.querySelectorAll('.canvas2');
  const ctxLayer = layer.getContext('2d');
  ctxLayer.clearRect(0, 0, 32, 32);
  ctxLayer.drawImage(framesCanvas[indexImage = ++indexImage % framesCanvas.length], 0, 0);
  if (timer) {
    clearInterval(timer);
  }
  timer = setTimeout(animationBackground, speed);
}

canvas.addEventListener('mouseup', animationBackground);
rangeFPS.addEventListener("input", animationBackground);

// Login with oAuth providers from Google
// instruction https://www.youtube.com/watch?v=XWz7YaI1Px0
// custom button http://programmerz.ru/questions/106356/google-signin-button-class-g-signin-question.html
(function() {
  var po = document.createElement('script');
  po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/api:client.js?onload=render';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
})();

function render() {
  gapi.signin.render('customBtn', {
    'callback': 'signinCallback',
    'clientid': '345168571290-gic51upkjdn53q76arqe2fo18rec3n1s.apps.googleusercontent.com',
    'cookiepolicy': 'single_host_origin',
    'scope': 'https://www.googleapis.com/auth/plus.login'
  });
  }
  function signinCallback(authResult) {
    // Respond to signin, see https://developers.google.com/+/web/signin/
  }