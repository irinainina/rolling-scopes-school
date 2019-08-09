// add a search box to the page with an input and a button
// add blocks for video cards and pagination
function init() {
  const body = document.querySelector('body');
  const search = document.createElement('div');
  search.classList.add('search');

  const input = document.createElement('input');
  input.autofocus = true;
  input.placeholder = 'Awesome Javascript';
  search.appendChild(input);

  const button = document.createElement('button');
  search.appendChild(button);
  body.appendChild(search);

  const container = document.createElement('div');
  container.classList.add('container');

  const items = document.createElement('div');
  items.classList.add('items');
  container.appendChild(items);
  body.appendChild(container);

  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  body.appendChild(pagination);
}

export default init;
