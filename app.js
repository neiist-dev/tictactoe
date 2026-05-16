class TicTacToe {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 1;
    this.gameOver = false;
    this.moveCount = 0;

    this.winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], //Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], //Columns
      [0, 4, 8], [2, 4, 6] //Diagonals
    ];
    this.players = { 1: 'X', '-1': 'O' };

    this.boxes = document.querySelectorAll(".box");
    this.msgContainer = document.querySelector(".msg-container");
    this.msg = document.querySelector("#msg");
    this.resetButton = document.querySelector("#reset-btn");
    this.newButton = document.querySelector("#new-btn")

    //Mount event listeners
    this.init();
  }

  init() {
    this.boxes.forEach((box, index) => {
      box.addEventListener("click", () => this.handleMove(index));
    });
    this.resetButton.addEventListener("click", () => this.resetGame());
    this.newButton.addEventListener("click", () => this.resetGame());
  }

  handleMove(index) {
    if (this.board[index] !== null || this.gameOver)
      return;

    this.applyMove(index);

    if (!this.gameOver && this.currentPlayer === -1)
      setTimeout(() => this.computerPlay(), 300);
  }

  applyMove(index) {
    this.board[index] = this.currentPlayer;
    this.moveCount++;

    if (this.checkWinner()) {
      this.gameOver = true;
      this.renderWinUI();
    } else if (this.moveCount === 9) {
      this.gameOver = true;
      this.renderDrawUI();
    } else {
      this.currentPlayer *= -1;
    }
    this.render();
  }

  checkWinner() {
    return this.winPatterns.find(([a, b, c]) => {
      const cell = this.board[a];
      return cell && cell === this.board[b] && cell === this.board[c];
    });
  }

  resetGame() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 1;
    this.gameOver = false;
    this.moveCount = 0;

    this.msgContainer.classList.add("hide");
    this.render();
  }

  computerPlay() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; ++i)
      if (this.board[i] === null) {
        this.board[i] = -1;
        let score = this.miniMax(this.board, 0, false);
        this.board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    this.applyMove(move);
  }

  miniMax(boardState, depth, isMaximazing) {
    const winner = this.checkWinner();
    if (winner)
      return isMaximazing ? -10 + depth : 10 - depth;

    if (this.board.filter(cell => cell === null).length === 0)
      return 0;

    if (isMaximazing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; ++i)
        if (boardState[i] === null) {
          boardState[i] = -1;
          let score = this.miniMax(boardState, depth + 1, false);
          boardState[i] = null;
          bestScore = Math.max(score, bestScore);
        }

      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; ++i)
        if (boardState[i] === null) {
          boardState[i] = 1;
          let score = this.miniMax(boardState, depth + 1, true);
          boardState[i] = null;
          bestScore = Math.min(score, bestScore);
        }

      return bestScore;
    }
  }

  renderWinUI() {
    this.msg.innerText = `O vencedor é: ${this.players[this.currentPlayer]}`;
    this.msgContainer.classList.remove("hide");
  }

  renderDrawUI() {
    this.msg.innerText = "Empate!";
    this.msgContainer.classList.remove("hide");
  }

  render() {
    this.board.forEach((value, index) => {
      this.boxes[index].innerText = (value !== null) ? this.players[value] : "";
      this.boxes[index].disabled = (value !== null || this.gameOver);
    })
  }
}

const game = new TicTacToe();
