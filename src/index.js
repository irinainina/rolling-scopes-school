import init from './functions';

init();

// search DOM elements
const body = document.querySelector('body');
const input = document.querySelector('input');
const button = document.querySelector('button');
const container = document.querySelector('.container');
const items = document.querySelector('.items');
const pagination = document.querySelector('.pagination');


// create a block for the user to select the page background
// because the web app design is also estimated
let randomColor;

function colorChange() {
  const colorpicker = document.createElement('div');
  colorpicker.classList.add('colorpicker');
  pagination.appendChild(colorpicker);

  colorpicker.addEventListener('click', () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 25 + 75);
    const l = Math.floor(Math.random() * 20 + 20);
    randomColor = `hsla(${h},${s}%,${l}%, 1)`;
    body.style.backgroundColor = randomColor;
    document.querySelectorAll('.title').forEach((el) => {
      if (!el) return;
      el.style.backgroundColor = randomColor;
    });
  });
}
colorChange();

const myAPIKey = 'AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y';
// spare APIKey if error 403 in console
// let myAPIKey = 'AIzaSyAe_uAyh4zZureWmCl7pHvX_z95SugkGdE';
// let myAPIKey = 'AIzaSyDA71YMC0DtbbpMXpQiZczqGflwBPB9BWQ';

// send a request to the YouTube API, get the video data
let nextPageToken;

function getVideoData() {
  const base = 'https://www.googleapis.com/youtube/v3/search?';
  const settings = `${nextPageToken ? `pageToken=${nextPageToken}` : ''}&key=${myAPIKey}&type=video&part=snippet&maxResults=15&q=${input.value}`;
  const url = base + settings;
  fetch(url)
    .then(response => response.json())
    .then((response) => {
      nextPageToken = response.nextPageToken;
      const arrVideoId = response.items.map(item => item.id.videoId);
      const listId = arrVideoId.join(',');
      return fetch(`https://www.googleapis.com/youtube/v3/videos?key=${myAPIKey}&id=${listId}&part=snippet,statistics`);
    })
    .then(response => response.json())
    .then((response) => {
      const arrVideoData = response.items.map(video => ({
        id: video.id.videoId,
        title: video.snippet.title,
        author: video.snippet.channelTitle,
        views: video.statistics.viewCount,
        published: video.snippet.publishedAt,
        pictureUrl: video.snippet.thumbnails.medium.url,
        description: video.snippet.description,
      }));
      render(arrVideoData);
    });
}

// get new video data when slider is turning
function newVideoData() {
  if (items.scrollWidth - items.scrollLeft < container.offsetWidth * 3) {
    getVideoData();
  }
}

// create cards with information about the video
function render(arrVideoData) {
  if (!input.value) return;
  arrVideoData.forEach((data) => {
    const item = document.createElement('div');
    item.classList.add('item');

    const picture = document.createElement('div');
    picture.classList.add('picture');

    const title = document.createElement('h3');
    title.classList.add('title');
    title.style.backgroundColor = randomColor || '#1b2735';

    const link = document.createElement('a');
    title.appendChild(link);
    picture.appendChild(title);
    item.appendChild(picture);

    const pAuthor = document.createElement('p');
    pAuthor.classList.add('author');
    item.appendChild(pAuthor);

    const pViews = document.createElement('p');
    pViews.classList.add('views');
    item.appendChild(pViews);

    const pPublished = document.createElement('p');
    pPublished.classList.add('published');
    item.appendChild(pPublished);

    const pDescription = document.createElement('p');
    pDescription.classList.add('description');
    item.appendChild(pDescription);

    picture.style.backgroundImage = `url(${data.pictureUrl})`;
    link.innerText = data.title;
    link.href = `https://youtu.be/${data.id}`;
    link.target = '_blank';
    pAuthor.innerText = data.author;
    pViews.innerText = data.views.replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
    pPublished.innerText = data.published.split('T')[0];
    pDescription.innerText = data.description;

    items.appendChild(item);
  });
}

// call getVideoData and currentNumPage functions
// on click the button or press the Enter key in the input
// update results when the input value change
button.addEventListener('click', () => {
  input.onchange = () => {
    items.innerHTML = '';
    nextPageToken = false;
    currentNumPage();
  };
  getVideoData();
  createPagination();
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    input.onchange = () => {
      items.innerHTML = '';
      nextPageToken = false;
      currentNumPage();
    };
    getVideoData();
    createPagination();
  }
});

// determine the width of the container on different devices
function widthContainer() {
  if (window.matchMedia('(min-width: 1440px)').matches) {
    maxNumPage = 24;
    container.style.width = '1440px';
  } else if (window.matchMedia('(min-width: 1080px) and (max-width: 1439px)').matches) {
    maxNumPage = 32;
    container.style.width = '1080px';
  } else if (window.matchMedia('(min-width: 720px) and (max-width: 1079px)').matches) {
    maxNumPage = 48;
    container.style.width = '720px';
  } else if (window.matchMedia('(min-width: 360px) and (max-width: 719px)').matches) {
    maxNumPage = 96;
    container.style.width = '360px';
  } else if (window.matchMedia('(min-width: 320px) and (max-width: 359px)').matches) {
    maxNumPage = 96;
    container.style.width = '320px';
  }
}

// create slider
// limit the maximum number of slides
let maxNumPage = 24;
let numPage = 1;
let isDown = false;
let startX;
let x;

function desktopSlider() {
  // switch isDown
  // startX determine the position of the mouse
  items.addEventListener('mousedown', (event) => {
    isDown = true;
    startX = event.pageX;
  });

  items.addEventListener('mouseleave', () => {
    isDown = false;
  });

  items.addEventListener('mouseup', (event) => {
    x = event.pageX;
    newVideoData();
  });

  // slider is turning when mouse move
  items.addEventListener('click', (event) => {
    if (!isDown) return;
    event.preventDefault();

    // determine direction the mouse move

    const walk = x - startX;

    // determine direction of turning the slider
    if (walk > 0 && numPage > 1) {
      items.scrollBy(-container.offsetWidth, 0);
      items.scrollLeft = container.offsetWidth * (numPage - 2);
      numPage--;
      currentNumPage();
    } else if (walk < 0 && numPage < maxNumPage) {
      items.scrollBy(container.offsetWidth, 0);
      items.scrollLeft = container.offsetWidth * numPage;
      numPage++;
      currentNumPage();
      newVideoData();
    }
  });
}
desktopSlider();

// slider in mobile device
function mobileSlider() {
  function getTouches(event) {
    return event.touches;
  }

  function handleTouchStart(event) {
    const firstTouch = getTouches(event)[0];
    isDown = firstTouch.clientX;
  }

  function handleTouchMove(event) {
    if (!isDown) return;
    x = event.touches[0].clientX;
    const walk = x - isDown;

    if (walk > 0 && numPage > 1) {
      items.scrollBy(-container.offsetWidth, 0);
      items.scrollLeft = container.offsetWidth * (numPage - 2);
      numPage--;
      currentNumPage();
    } else if (walk < 0 && numPage < maxNumPage) {
      items.scrollBy(container.offsetWidth, 0);
      items.scrollLeft = container.offsetWidth * numPage;
      numPage++;
      currentNumPage();
      newVideoData();
    }
    isDown = false;
  }
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
}

// device selection for slider
function selectionDevice() {
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    mobileSlider();
  }
}
selectionDevice();

window.addEventListener('resize', () => {
  selectionDevice();
  widthContainer();
  numPage = Math.round(items.scrollLeft / container.offsetWidth) + 1;
  currentNumPage();
});

// create pagination
let isPagination = false;

function createPagination() {
  if (isPagination || !input.value) return;

  for (let i = 0; i < 4; i++) {
    const page = document.createElement('li');
    page.classList.add('page');

    const tooltip = document.createElement('span');
    tooltip.classList.add('tooltip');
    page.appendChild(tooltip);

    if (i === 0) {
      page.classList.add('prevprevpage');
    } else if (i === 1) {
      page.classList.add('prevpage');
    } else if (i === 2) {
      page.classList.add('pageactive');
    } else if (i === 3) {
      page.classList.add('nextpage');
    }
    pagination.appendChild(page);
  }
  isPagination = true;
}

// add style of the current page
function currentNumPage() {
  const pages = pagination.querySelectorAll('.page');
  const tooltips = pagination.querySelectorAll('.tooltip');

  if (!input.value || numPage < 1) return;

  const pageactive = pagination.querySelector('.pageactive');
  pageactive.innerText = numPage || 1;

  tooltips.forEach((tooltip, index) => {
    if (numPage === 1) {
      tooltip.innerText = numPage + 1;
    } else if (numPage === 2 && index === 1) {
      tooltip.innerText = numPage - 1;
    } else if (numPage === 2 && index === 2) {
      tooltip.innerText = numPage + 1;
    } else if (numPage > 2 && index === 0) {
      tooltip.innerText = numPage - 2;
    } else if (numPage > 2 && index === 1) {
      tooltip.innerText = numPage - 1;
    } else if (numPage > 2 && index === 2) {
      tooltip.innerText = numPage + 1;
    }
  });

  pages.forEach((page, index) => {
    if (numPage === 1 && index === 0) {
      page.classList.add('pagedisable');
    } else if (numPage === 1 && index === 1) {
      page.classList.add('pagedisable');
    } else if (numPage === 2 && index === 0) {
      page.classList.add('pagedisable');
    } else if (numPage === maxNumPage && index === 3) {
      page.classList.add('pagedisable');
    } else {
      page.classList.remove('pagedisable');
    }
  });
}

// page turning
pagination.addEventListener('click', (event) => {
  // page turning by click on buttons 'Previous' and 'Next'
  if (event.target.classList.contains('prevprevpage')) {
    items.scrollBy(-container.offsetWidth * 2, 0);
    numPage -= 2;
    items.scrollLeft = container.offsetWidth * (numPage - 1);
    currentNumPage();
  } else if (event.target.classList.contains('prevpage')) {
    items.scrollBy(-container.offsetWidth, 0);
    numPage--;
    items.scrollLeft = container.offsetWidth * (numPage - 1);
    currentNumPage();
  } else if (event.target.classList.contains('nextpage')
           && numPage < maxNumPage) {
    items.scrollBy(container.offsetWidth, 0);
    numPage++;
    items.scrollLeft = container.offsetWidth * (numPage - 1);
    currentNumPage();
  }
  newVideoData();
});
module.exports = render;
