// add edit width and height dimensions of the board
// add load images

const width = 25;
const height = 20;

/**
 * Create a Game of Life instance
 */

// const gol = new (require('.golscript'))(25, 20);

const gol = new GameOfLife(width, height);

/**
 * create a table and append to the DOM
 */

//Table cells created below with coordinates are stored in an array
const tds = [];

// <table> element
const table = document.createElement('tbody');
table.className = 'gol';
// build a table row <tr>
for (let h = 0; h < height; h++) {
  const tr = document.createElement('tr');
  // build a table column <td>
  for (let w = 0; w < width; w++) {
    const td = document.createElement('td');
    // We'll put the coordinates on the cell
    // Element itself (using dataset),
    // letting us fetch it in a click listener later.
    td.dataset.row = h;
    td.dataset.col = w;
    tds.push(td);
    tr.append(td);
  }
  table.append(tr);
}
document.getElementById('board').append(table);

/**
 * Draws every cell from the gol instance into an actual, visible DOM element
 */

const paint = () => {
  //loops through and toggles class on td elements
  for (let i = 0; i < tds.length; i++) {
    if (gol.getCell(tds[i].dataset.row, tds[i].dataset.col) === 1) {
      tds[i].classList.add('alive');
    } else {
      tds[i].classList.remove('alive');
    }
  }
};

/**
 * Event Listeners
 */

document.getElementById('board').addEventListener('click', (event) => {
  //event.target.dataset accesses the values on the td element, updates the board and adds 'alive' class;
  gol.setCell(1, event.target.dataset.row, event.target.dataset.col);
  paint();
});

function update() {
  gol.tick();
  paint();
}

document.getElementById('step_btn').addEventListener('click', () => {
  update();
});

let playing = false;
let play;
let playBtn = document.getElementById('play_btn');
playBtn.addEventListener('click', () => {
  if (!playing) {
    play = setInterval(() => update(), 80);
    //button remains 'in focus' to signify play is still 'on' when clicking other buttons
    playBtn.classList.add('playing');
    playing = true;
  } else {
    clearInterval(play);
    playBtn.classList.remove('playing');
    playing = false;
  }
});

document.getElementById('random_btn').addEventListener('click', () => {
  for (let i = 0; i < tds.length; i++) {
    gol.setCell(
      Math.round(Math.random()),
      tds[i].dataset.row,
      tds[i].dataset.col
    );
  }
  paint();
});

document.getElementById('clear_btn').addEventListener('click', () => {
  for (let i = 0; i < tds.length; i++) {
    gol.setCell(0, tds[i].dataset.row, tds[i].dataset.col);
  }
  paint();
});
