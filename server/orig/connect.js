class Game {
  constructor(width, height){
    this.height = height;
    this.width = width;
    this.board = this.makeBoard();
    this.player = 'r';
  }

  makeBoard() {
    let board = [];
    for(let i = 0; i<this.height; i++){
      let row = [];
      for(let j = 0; j<this.width; j++){
        row.push(0);
      }
      board.push(row);
    }
    return board;
  }

  //function to see if the col is open
  setCell(col){
    for(let i=this.height-1; i>=0; i--){
      if(this.board[i][col] === 0){
        this.board[i][col] = this.player;
        return ([i+'', col]);
      }
    }
  }

  changePlayer(){
    if(this.player === 'r'){
      this.player = 'y';
    }else{
      this.player = 'r';
    }
  }

  // eslint-disable-next-line complexity
  checkHorizontal(val){
    for(let i = 0; i<this.height; i++){
      let count = 0;
      for(let j = 0; j<this.width; j++){
        if(this.board[i][j] === val && count > 0){
          count++;
        }else if(this.board[i][j] === val && count === 0){
          count = 1;
        }else if(this.board[i][j] !== val){
          count = 0;
        }
        if(count === 4){
          return "Win";
        }
      }
    }
  }

  // eslint-disable-next-line complexity
  checkVertical(val){
    for(let j = 0; j<this.width; j++){
      let count = 0;
      for(let i = 0; i<this.height; i++){
        if(this.board[i][j] === val && count > 0){
          count++;
        }else if(this.board[i][j] === val && count === 0){
          count = 1;
        }else if(this.board[i][j] !== val){
          count = 0;
        }
        if(count === 4){
          return "Win";
        }
      }
    }
  }

  getCell(row, col) {
    //this returns a value for the cell and 0 if invalid
    if (row < 0 || row > this.height - 1) {
      return 0;
    }
    if (col < 0 || col > this.width - 1) {
      return 0;
    }
    return this.board[row][col];
  }

  checkDiagonal(val){
    for(let i=0; i<this.height; i++){
      for(let j=0; j<this.width; j++){
        if(this.board[i][j] === val){
          let left = this.searchDiagLeft(val, 1, i, j);
          let right = this.searchDiagRight(val, 1, i, j);
          console.log('left--->', left);
          console.log('right--->', right);
          if(left === "Win" || right === "Win"){
            return "Win";
          }
          // return this.searchDiagLeft(val, 1, i, j) === "Win" ? "Win"
          // : this.searchDiagRight(val, 1, i, j) === "Win" ? "Win"
          // : null;
        }
      }
    }
  }

  searchDiagLeft(val, count, i, j){
    if(count === 4){
      return 'Win';
    }
    if(this.getCell(i+1, j-1) === val){
      console.log('weMadeIt-->', this.board[i+1][j-1]);
      count++;
      console.log('1st D left-->', count);
      return this.searchDiagLeft(val, count, i+1, j-1);
    }
  }

  searchDiagRight(val, count, i, j){
    if(count === 4){
      return 'Win';
    }
    if(this.getCell(i+1, j+1) === val){
      count++;
      return this.searchDiagRight(val, count, i+1, j+1);
    }
  }

  checkBoard(val){
    if(this.checkDiagonal(val) === 'Win'){
      return 'Win';
    }
    if(this.checkHorizontal(val) === 'Win'){
      return 'Win';
    }
    if(this.checkVertical(val) === 'Win'){
      return 'Win';
    }
  }
}

const width = 7;
const height = 6;
const game = new Game(width, height);

//Table cells created below with coordinates are stored in an array
//this array will be on state
const tds = [];
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

document.getElementById('connect').append(table);

//table is on the dom.. now add listeners for adding pieces to the columns.
function addColor(x,y){
  for (let i = 0; i < tds.length; i++) {
    if (tds[i].dataset.row === x && tds[i].dataset.col === y){
    tds[i].classList.add(game.player);
    }
  }
}

document.getElementById('connect').addEventListener('click', (event) => {
  //event.target.dataset accesses the values on the td element, updates the board and adds 'alive' class;
  let coord = game.setCell(event.target.dataset.col);

  addColor(coord[0], coord[1]);
  if(game.checkBoard(game.player) === "Win"){
    document.getElementById('winner').classList.remove('hidden');
  }
  game.changePlayer();
  if(game.player === 'r'){
    document.getElementById('player_y').classList.add('hidden');
    document.getElementById('player_r').classList.remove('hidden');
  }else{
    document.getElementById('player_r').classList.add('hidden');
    document.getElementById('player_y').classList.remove('hidden');
  }
});

document.getElementById('restart_btn').addEventListener('click', () => {
  document.getElementById('winner').classList.add('hidden');
  game.board = game.makeBoard();
  for (let i = 0; i < tds.length; i++) {
    tds[i].classList.remove("r","y");
  }
});
