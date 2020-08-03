class GameOfLife {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = this.makeBoard();
  }

  makeBoard() {
    let board = [];
    for (let i = 0; i < this.height; i++) {
      let row = [];
      for (let j = 0; j < this.width; j++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
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

  setCell(value, row, col) {
    //this sets the value for valid cells
    if (
      (row > 0 || row < this.height - 1) &&
      (col > 0 || col < this.width - 1)
    ) {
      this.board[row][col] = value;
    }
  }

  //this returns a new value for a cell based on conway's rules
  toggleCell(row, col) {
    let neighborCount = this.livingNeighbors(row, col);
    let cellValue = this.getCell(row, col);
    if (cellValue === 1 && (neighborCount < 2 || neighborCount > 3)) {
      cellValue = 0;
    } else if (cellValue === 0 && neighborCount === 3) {
      cellValue = 1;
    }
    return cellValue;
  }

  livingNeighbors(row, col) {
    let sum =
      this.getCell(row - 1, col - 1) +
      this.getCell(row - 1, col) +
      this.getCell(row - 1, col + 1) +
      this.getCell(row, col - 1) +
      this.getCell(row, col + 1) +
      this.getCell(row + 1, col - 1) +
      this.getCell(row + 1, col) +
      this.getCell(row + 1, col + 1);

    return sum;
  }

  /**
   * Given the present board, apply the rules to generate a new board
   */

  tick() {
    //updates board
    const newBoard = this.makeBoard();

    // loop through current board (this.h, this.w) and update newBoard
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        newBoard[i][j] = this.toggleCell(i, j);
      }
    }
    this.board = newBoard; //replace board with newBoard
  }
}
