const activeColor = document.querySelector('.active-color');
const resizeInput = document.getElementsByName('resize');
const parent = document.querySelector('.previews-list');
const tools = document.querySelector('.tools');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let x1, x2;

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
  return sizeCanvas;
}

resizeInput.forEach(input => input.addEventListener("click", resizeCanvas));

// scale the mouse position on canvas
function scale() {
  let pos = canvas.offsetWidth / canvas.width;
  return pos;
}

// coordinates start mouse move 
canvas.addEventListener('mousedown', () => {
  x1 = Math.floor(event.offsetX / scale());
  y1 = Math.floor(event.offsetY / scale());
});

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

canvas.addEventListener('mouseleave', () => {
  isDrawing = false;
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

// drawing with pen on the canvas
function pen(event) {
  if (currentTool() !== 'pen' || !isDrawing) return;
  ctx.fillStyle = currentColor();
  let size = boxSize();
  const x = Math.floor(event.offsetX / scale() / size) * size;
  const y = Math.floor(event.offsetY / scale() / size) * size;
  ctx.fillRect(x, y, size, size);
}

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
function bucket() {
  if (currentTool() !== 'bucket') return;
  ctx.fillStyle = currentColor();
  ctx.fillRect(0, 0, canvas.width, canvas.width);
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

// drawing line - not good work
function stroke(event) {
  if (currentTool() !== 'stroke' || !isDrawing) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = boxSize();
  ctx.strokeStyle = currentColor();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(event.offsetX / scale(), event.offsetY / scale());
  ctx.stroke();
}

// drawing rectangle - not good work
function rectangle(event) {
  if (currentTool() !== 'rectangle' || !isDrawing) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = boxSize();
  ctx.strokeStyle = currentColor();
  x2 = Math.floor(event.offsetX / scale());
  y2 = Math.floor(event.offsetY / scale());
  let width = x2 - x1;
  let height = y2 - y1;
  if (boxSize() === 1 || boxSize() === 3) {
    ctx.strokeRect(x1 + 0.5, y1 + 0.5, width, height);
  } else {
    ctx.strokeRect(x1, y1, width, height);
  }
}

// drawing circle - not good work
function circle(event) {
  if (currentTool() !== 'circle' || !isDrawing) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = boxSize();
  ctx.strokeStyle = currentColor();
  x2 = Math.floor(event.offsetX / scale());
  y2 = Math.floor(event.offsetY / scale());
  let x = x2 > x1 ? x1 + (x2 - x1) / 2 : x2 + (x1 - x2) / 2;
  let y = y2 > y1 ? y1 + (y2 - y1) / 2 : y2 + (y1 - y2) / 2;
  let r = Math.abs((x2 - x1) / 2) > Math.abs((y2 - y1) / 2) ? Math.abs((x2 - x1) / 2) : Math.abs((y2 - y1) / 2);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.stroke();
}

// move canvas - not good work
function move(event) {
  if (currentTool() !== 'move' || !isDrawing) return;
  canvas.style.left = event.pageX - canvas.offsetWidth / 2 + "px";
  canvas.style.top = event.pageY - canvas.offsetHeight / 2 + "px";
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

// key activation tools
window.addEventListener('keydown', function(event) {
  if (event.code === "KeyP") {
    tools.querySelector('input[value="pen"]').checked = true;
  } else if (event.code === "KeyV") {
    tools.querySelector('input[value="mirror"]').checked = true;
  } else if (event.code === "KeyB") {
    tools.querySelector('input[value="bucket"]').checked = true;
  } else if (event.code === "KeyE") {
    tools.querySelector('input[value="eraser"]').checked = true;
  } else if (event.code === "KeyA") {
    tools.querySelector('input[value="brush"]').checked = true;
  } else if (event.code === "KeyL") {
    tools.querySelector('input[value="stroke"]').checked = true;
  } else if (event.code === "KeyR") {
    tools.querySelector('input[value="rectangle"]').checked = true;
  } else if (event.code === "KeyC") {
    tools.querySelector('input[value="circle"]').checked = true;
  } else if (event.code === "KeyM") {
    tools.querySelector('input[value="move"]').checked = true;
  } else if (event.code === "KeyO") {
    tools.querySelector('input[value="color-picker"]').checked = true;
  }
});

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
      console.log(y, y1);
      if (y > y1 - 45 && y < y1 + 45) {
        console.log(item.firstElementChild);
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

const layer = document.querySelector('.layer');
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
  const elem = document.querySelector('.layer');
  if (!document.fullscreenElement) {
    elem.requestFullscreen();
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
