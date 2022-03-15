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
    //have gone through col and it is full
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
      count++;
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

export default Game;
