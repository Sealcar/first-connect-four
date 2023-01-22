const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']]

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
    Screen.setGridlines(true);

    // Replace this with real commands
    Screen.addCommand('left', 'Move cursor left', this.cursor.left);
    Screen.addCommand('right', 'Move cursor right', this.cursor.right);
    Screen.addCommand('down', 'Drop a piece', this.placeMove);



    this.cursor.setBackgroundColor();
    Screen.render();
  }

  static _checkRows(grid) {
    let space = 0;
    for (let i = 0; i < grid.length; i++) {
      let xCount = 1;
      let oCount = 1;
      for (let j = 1; j < grid[i].length; j++) {
        let current = grid[i][j];
        let last = grid[i][j - 1];
        if (current === ' ') {
          space++;
          xCount = 1;
          oCount = 1;
        } else if (current === last) {
          if (current === 'X') {
            xCount++;
            if (xCount === 4) {
              return 'X';
            }
          } else if (current === 'O') {
            oCount++;
            if (oCount === 4) {
              return 'O'
            }
          }
        }
      }
    }
    if (space !== 0) {
      return 0;
    }
  }

  static _checkCols(grid) {
    for (let i = 0; i < grid[0].length; i++) {
      let xCount = 1;
      let oCount = 1;
      for (let j = 1; j < grid.length; j++) {
        let current = grid[j][i];
        let last = grid[j - 1][i];
        if (current === ' ') {
          xCount = 1;
          oCount = 1;
        } else if (current === last) {
          if (current === 'X') {
            xCount++;
            if (xCount === 4) {
              return 'X';
            }
          } else if (current === 'O') {
            oCount++;
            if (oCount === 4) {
              return 'O'
            }
          }
        }
      }
    }
  }

  static _checkDiags(grid) {
    for (let i = 0; i < grid.length - 3; i++) {
      for (let j = 0; j < grid[0].length - 3; j++) {
        if (grid[i][j] !== ' ') {
          let inRightDiag = 1;
          for (let k = 1; k < 4; k++) {
            if (grid[i + k][j + k] === grid[i + (k - 1)][j + (k - 1)]) {
              inRightDiag++;
              if (inRightDiag === 4) {
                return grid[i][j];
              }
            } else {
              break;
            }
          }
        }
      }
      for (let l = grid[0].length - 1; l > 2; l--) {
        if (grid[i][l] !== ' ') {
          let inLeftDiag = 1;
          for (let m = 1; m < 4; m++) {
            if (grid[i + m][l - m] === grid[i + m - 1][l - m + 1]) {
              inLeftDiag++;
              if (inLeftDiag === 4) {
                return grid[i][l];
              }
            } else {
              break;
            }
          }
        }
      }
    }
  }


  static checkWin(grid) {
    let rows = this._checkRows(grid);
    let cols = this._checkCols(grid);
    let diags = this._checkDiags(grid);
    if (rows) {
      return rows;
    } else if (cols) {
      return cols;
    } else if (diags) {
      return diags;
    } else if (rows === 0) {
      return false;
    } else {
      return 'T';
    }
  }

  placeMove = () => {
    const rows = this.cursor.numRows;
    const col = this.cursor.col;
    for (let i = rows - 1; i >= 0 ; i--) {
      if (this.grid[i][col] === ' ') {
        Screen.setGrid(i, col, this.playerTurn);
        this.grid[i][col] = this.playerTurn;
        break;
      }
    }

    if (this.playerTurn === 'O') {
      this.playerTurn = 'X';
    } else {
      this.playerTurn = 'O';
    }
    let winner = ConnectFour.checkWin(this.grid);

    if (winner) {
      ConnectFour.endGame(winner);
    }
    Screen.setMessage([this.cursor.row, this.cursor.col]);
  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = ConnectFour;
