function boxSize(sizeInput) {
  let currentBoxSize = 1;
  sizeInput.forEach(size => {
    if (size.checked) {
      currentBoxSize = +size.value;
    }
  });
  return currentBoxSize;
}

function resizeCanvas(resizeInput) {
  let sizeCanvas;
  resizeInput.forEach(resize => {
    if (resize.checked) {
      sizeCanvas = resize.value;
    }
  });

  return sizeCanvas;
}

function scale(canvas) {
  let pos = canvas.offsetWidth / canvas.width;
  return pos;
}

module.exports = {boxSize, resizeCanvas, scale};
