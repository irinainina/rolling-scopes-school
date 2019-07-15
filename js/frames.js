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
let isAggFrame = false;
function addFrame() {
  const elem = parent.querySelector('.preview-container');
  const clone = elem.cloneNode(true);
  parent.appendChild(clone);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frameNumber();
  frameStyle();
  isAggFrame = true;
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
