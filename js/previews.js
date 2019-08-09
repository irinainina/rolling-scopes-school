const layer = document.querySelector('.layer');

// layer management
const layerManagementContainer = document.querySelector('.layer-management-layer-container');

// create new layers when click add layer
function createLayer() {
  const addLayer = document.createElement('div');
  addLayer.classList.add('layer-management-layer');
  addLayer.innerText = 'Layer ';
  addLayer.dataset.layernum = layerManagementContainer.children.length +
    1;

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

    if (layer.dataset.layernum == layerManagementContainer.children.length) {
      layer.classList.add('layer-management-layer-active');
    }
  })
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

  const mainContainer = document.querySelector('.main-container');
  mainContainer.appendChild(canvasTemp);

  return canvasTemp;
}

const layerArr = [];

function createLayerArr() {
  const canvasTemp = createCanvasTemp();
  const ctxTemp = canvasTemp.getContext('2d');
  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  layerArr.push(myImageData);
  for(let i = 0; i < layerArr.length; i++) {
    ctxTemp.putImageData(layerArr[i], 0, 0);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function layerPlus() {
  createLayer();
  styleActiveLayer();
  createCanvasTemp();
  createLayerArr();
  if(isAggFrame) {
    layerArr.length = 0;
  }
}

function layerA() {
  return 3;
}

function layerDelete() {
  console.log('-');
}

function layerUp() {
  console.log('up');
}

function layerDown() {
  console.log('down');
}

function layerManagementBtnDelegation(event) {
  if (!event.target.classList.contains('layer-management-btn')) return;
  if (event.target.classList.contains('btn-plus')) {
    layerPlus();
  } else if (event.target.classList.contains('btn-delete')) {
    layerDelete();
  } else if (event.target.classList.contains('btn-up')) {
    layerUp();
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
  let speed = 1000 / rangeFPS.value;
  return speed;
}

function animationBackground() {
  let speed = animationSpeed();
  const framesCanvas = document.querySelectorAll('.canvas2');
  const ctxLayer = layer.getContext('2d');
  ctxLayer.clearRect(0, 0, layer.width, layer.height);
  ctxLayer.drawImage(framesCanvas[indexImage = ++indexImage % framesCanvas.length], 0, 0);
  if (timer) {
    clearInterval(timer);
  }
  timer = setTimeout(animationBackground, speed);
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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvas2.width;
    canvas.height = canvas2.height;
    ctx.fillStyle = 'rgba(225,225,225,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas2, 0, 0);
    images.push(canvas.toDataURL());
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
    const partData = ctx.getImageData(0, 0, canvas2.width, canvas2.height).data.buffer;
    data.push(partData);
  });
  return data;
}

function saveImageAsApng() {
  const arrAnimationSpeed = new Array(ArrayBufferData().length);
  arrAnimationSpeed.fill(animationSpeed());
  const imageData = UPNG.encode(ArrayBufferData(), canvas.width, canvas.height, 0, arrAnimationSpeed);
  download(imageData, 'newAPNG.apng', 'apng');
}

const saveApng = document.querySelector('.save-apng');
saveApng.addEventListener('click', saveImageAsApng);

// save image as piskel
function saveImageAsPiskel() {
  const fps = rangeFPS.value;
  const height = canvas.height;
  const width = canvas.width;
  const frameCount = framesToImages().length;
  const images = framesToImages().join('\\');
  const piskel = `{"modelVersion":2,"piskel":{"name":"","description":"","fps":${fps},"height":${height},"width":${width},"layers":["{\"name\":\"Layer 1\",\"opacity\":1,\"frameCount\":${frameCount},\"chunks\":[{\"layout\":[],\"base64PNG\":${images}}]}"],"hiddenFrames":[]}}`
  download(piskel, 'newPiskel.piskel', 'piskel');
}

const savePiskel = document.querySelector('.save-piskel');
savePiskel.addEventListener('click', saveImageAsPiskel);

// save image as png
function saveImageAsPng() {
  const canvas2All = document.querySelectorAll('.canvas2');
  const canvasToPng = document.createElement('canvas');
  const ctx = canvasToPng.getContext('2d');
  canvasToPng.width = canvas.width;
  canvasToPng.height = canvas.height;
  canvas2All.forEach(canvas2 => {
    ctx.drawImage(canvas2, 0, 0);
  });
  const image = canvasToPng.toDataURL();
  download(image, 'newPng.png', 'png');
}

const savePng = document.querySelector('.save-png');
savePng.addEventListener('click', saveImageAsPng);

// Login with oAuth providers from Google
const signInBtn = document.querySelector('.signin');
const signOutBtn = document.querySelector('.signout');
const userName = document.querySelector('.user-name');
const userPhoto = document.querySelector('.user-photo');

function signIn () {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signIn({ scope: 'https://www.googleapis.com/auth/drive' }).then(googleUser => {
    const profile = googleUser.getBasicProfile();
    userName.innerText = profile.getName();
    userPhoto.src = profile.getImageUrl() || url('assets/svg/profile.svg');
    signInBtn.classList.add('btn-hide');
    signOutBtn.classList.remove('btn-hide');
  })
}

signInBtn.addEventListener('click', signIn);

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    userName.innerText = '';
    userPhoto.src = '';
    signInBtn.classList.remove('btn-hide');
    signOutBtn.classList.add('btn-hide');
  });
}

signOutBtn.addEventListener('click', signOut);

function onLoad() {
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
}

// upload image to Google Drive
const saveToGoogleDrive = (fileContent) => {
  const arrAnimationSpeed = new Array(ArrayBufferData().length);
  arrAnimationSpeed.fill(animationSpeed());
  const imageData = UPNG.encode(ArrayBufferData(), canvas.width, canvas.height, 0, arrAnimationSpeed);

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

// сохранение состояния элементов в LocalStorage


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

const activeColor = document.querySelector('.active-color');
const prevColor = document.querySelector('.prev-color');
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

/*
function saveFrames() {
  const canvas2All = document.querySelectorAll('.canvas2');
  const framesLength = canvas2All.length;
  localStorage.setItem('framesLength', framesLength);

  for(let i = 0; i < framesLength; i++) {
      const framesUrl = canvas2All[i].toDataURL();
      localStorage.setItem(i, framesUrl);
    }
}

addFrameButton.addEventListener('click', saveFrames);
parent.addEventListener('click', saveFrames);
*/
// восстановления состояния элементов после перезагрузки
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
    savedImage = new Image();
    savedImage.src = localStorage.getItem('url');
    savedImage.onload = function() {
      ctx.drawImage(savedImage, 0, 0);
      frameCreate();
      animationBackground();
    }
  }
/*
  if(localStorage.getItem('framesLength')) {
    const framesLength = localStorage.getItem('framesLength');
    for(let i = 1; i < framesLength; i++) {
      addFrame();
    }

    const canvas2All = document.querySelectorAll('.canvas2');

    canvas2All.forEach((canvas2, index) => {
      const ctx2 = canvas2.getContext('2d');
      framesImage = new Image();
      framesImage.src = localStorage.getItem(index);
        framesImage.onload = function() {        ctx2.drawImage(framesImage, 0, 0);
      }
    });
  }
  */
}

// clear localStorage
const btnCreate = document.querySelector('.btn-create');
btnCreate.onclick = function() {
    localStorage.clear();
  }
















