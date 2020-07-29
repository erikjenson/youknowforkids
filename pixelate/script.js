const table = document.getElementsByTagName('table')[0];

let input = document.getElementsByClassName('num-col')[0];

let numCol = 0;

input.addEventListener('change', function (event) {
  numCol = event.target.value;
});

function makeRow() {
  const tr = document.createElement('tr');

  for (let i = 0; i < numCol; i++) {
    let td = document.createElement('td');
    td.className = 'white';
    tr.appendChild(td);
  }
  table.appendChild(tr);
}

const addButton = document.getElementById('add-row');
addButton.addEventListener('click', makeRow);

let selCol = 'red';

const selectBtn = document.getElementsByClassName('color')[0];

selectBtn.addEventListener('change', function (event) {
  selCol = event.target.value;
});

function colorize(event) {
  if (event.target.tagName === 'TD') {
    event.target.className = selCol;
  }
}

function addMouseOver() {
  table.addEventListener('mouseover', colorize);
}
function removeMouseOver() {
  table.removeEventListener('mouseover', colorize);
}

table.addEventListener('mousedown', addMouseOver);
table.addEventListener('mouseup', removeMouseOver);
table.addEventListener('click', colorize);

const colorOption = document.getElementsByClassName('color-option')[0];

colorOption.addEventListener('change', function (event) {
  if (event.target.value === 'clear') {
    const cells = [...document.getElementsByTagName('TD')];
    cells.forEach((e) => {
      e.className = selCol;
    });
  }
  if (event.target.value === 'fill') {
    const cells = [...document.getElementsByTagName('TD')];
    cells.forEach((e) => {
      if (e.className === 'white') e.className = selCol;
    });
  }
});
