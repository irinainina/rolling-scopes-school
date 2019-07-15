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
  ctxLayer.clearRect(0, 0, layer.width, layer.height);
  ctxLayer.drawImage(framesCanvas[indexImage = ++indexImage % framesCanvas.length], 0, 0);
  if (timer) {
    clearInterval(timer);
  }
  timer = setTimeout(animationBackground, speed);
}

canvas.addEventListener('mouseup', animationBackground);
rangeFPS.addEventListener("input", animationBackground);


// save image as gif
// https://github.com/yahoo/gifshot
// https://github.com/rndme/download
function framesToImages() {
  const canvas2All = document.querySelectorAll('.canvas2');
  const images = [];
  canvas2All.forEach(canvas2 => images.push(canvas2.toDataURL("image/png")));
  return images;
}

const saveImage = document.querySelector('.btn-save');

/*
saveImage.addEventListener('click', () => {
  gifshot.createGIF({
    images: framesToImages(),
    interval: 1 / rangeFPS.value,
    gifWidth: canvas.width,
    gifHeight: canvas.height,
  }, (obj) => {
    if (!obj.error) {
      const image = obj.image;
      download(image, 'newGif.gif', 'gif');
    }
  });
});

*/
// // save image as apng
// https://github.com/photopea/UPNG.js
function ArrayBufferData() {
  const data = [];
  const canvases = document.querySelectorAll('.canvas2');

  function getData(item) {
    const ctx = item.getContext('2d');
    const partData = ctx.getImageData(0, 0, 32, 32).data.buffer;
    data.push(partData);
  }
  canvases.forEach(getData);
  return data;
}

function saveImageAsApng() {
  const arrAnimationSpeed = new Array(ArrayBufferData().length);
  arrAnimationSpeed.fill(animationSpeed());
  const imageData = UPNG.encode(ArrayBufferData(), 32, 32, 0, arrAnimationSpeed);
  download(imageData, 'newAPNG.apng', 'apng');
}

saveImage.addEventListener('click', saveImageAsApng);

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

