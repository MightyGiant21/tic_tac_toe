// This is a module.
// Use a module because there is only one of these objects.
// Try to declare all variables in the function they need to be in.
const gameBoard = (() => {
    let boardData = 
    [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
    ];

    // Define game variables
    let player = 1;
    let gameOver = false;
    let winner = 0;
    let tie = false;

    const grid = document.querySelectorAll(".cell");

    const init = () => {
      const submitBtn = document.querySelector(".submit");
      // For some reason I have to hide the cells here.
      // Setting display none in css doesn't work.
      grid.forEach(cell => {
        cell.style.display = "none"
      });
      submitBtn.addEventListener('click', () => {
        hasFormBeenCompleted();
        players.init(playerOne.value, playerTwo.value);
      });
      const players = createPlayer();

      // Query selector for text display for game outcome
      gameOutcomeText = document.querySelector(".game-outcome");

      // Create restart button
      restartButton = document.querySelector(".restart");
      restartButton.addEventListener("click", (restartGame));
      
      checkTurn();
    };

    const hasFormBeenCompleted = () => {
      const form = document.querySelector("#playerForm");
      if (validationCheck() == true) {
        form.style.display = "none";
        grid.forEach(cell => {
          cell.style.display = "";
        });
      };
    };
    
    // Validation check on both names.
    const validationCheck = () => {
      // Not really sure how this works as these variables are never declared.
      if (playerOne.value.match("^[A-Za-z]{1,100}") &&
          playerTwo.value.match("^[A-Za-z]{1,100}")) {
        return true
      } else {
        return false
      };
    };

    const takeTurn = (index) => {
      if (gameOver == false) {
        // Remainder by the square amount.
        // 4x4 = remainder 4.
        // 10x10 = remainder 10.
        let j = index % 3;
        // J is columns.
        // If cell 4 is 1, I = 4 - J (Which is 1 because it's the % of 4/3).
        // The reason for 4/3 is because we have a % 3.
        // 4 - J(1) = 3
        // I = 3/3
        let i = (index - j) / 3;
        // Check if the cell is empty
        if (boardData[i][j] == 0) {
          // Place current player marker in cell
          boardData[i][j] = player;
          // Change player (if player is 1, it becomes -1. If player is -1 it becomes 1. So this way it always toggles between player 1 and -1)
          player *= -1
          // Update game board with markers
          drawMarkers();
          // Check to see if the game is over
          checkGameOver();
        };
      };
    };

    // Function for checking which cell has been clicked
    const checkTurn = () => {
      grid.forEach((cell, index) => {
          cell.addEventListener('click', () => {
            takeTurn(index);
          });
      });
    };

    // Function for drawing the markers on the game board
    const drawMarkers = () => {
      const board = document.querySelector(".board");
      for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
          if (boardData[i][j] == 1) {
            board.children[(i*3) + j].classList.add("x");
          } else if (boardData[i][j] == -1) {
            board.children[(i*3) + j].classList.add("circle");
          };
        };
      };
    };

    // Function to check the winner
    const checkGameOver = () => {
      // Check rows and columns
      for (i = 0; i < boardData.length; i++) {
        let rowSum = boardData[i][0] + boardData[i][1] + boardData[i][2];
        let colSum = boardData[0][i] + boardData[1][i] + boardData[2][i];
        // Check if all X or all O in any rows or columns
        if (rowSum == 3 || colSum == 3) {
          gameOver = true;
          winner = 1;
        } else if (rowSum == -3 || colSum == -3) {
          gameOver = true;
          winner = -1;
        }
      }

      // Check diagonals
      let diagonalSum1 = boardData[0][0] + boardData[1][1] + boardData[2][2]
      let diagonalSum2 = boardData[0][2] + boardData[1][1] + boardData[2][0]
      if (diagonalSum1 == 3 || diagonalSum2 == 3) {
        gameOver = true;
        winner = 1;
      } else if (diagonalSum1 == -3 || diagonalSum2 == -3) {
        gameOver = true;
        winner = -1;
      }

      // Check for a tie
      if (boardData[0].indexOf(0) == -1 && 
          boardData[1].indexOf(0) == -1 && 
          boardData[2].indexOf(0) == -1) {
          gameOver = true;
          tie = true;
        };

      // If game is over then trigger the appropriate function and display text
      // 
      // R: I have manually typed player 1 wins and player 2 wins. 
      // This should instead take the player names from the object.
      // This also needs to increase score
      // 
      if (gameOver == true) {
        if (winner == 1) {
          gameOutcomeText.textContent = `Player 1 Wins!!`;
        } else if (winner == -1) {
          gameOutcomeText.textContent = `Player 2 Wins!!`;
        } else if (tie == true) {
          gameOutcomeText.textContent = "It's a Tie!";
        }
      }
    };

    // Add function to restart the game
    const restartGame = () => {
      // reset game variables
      gameOver = false;
      winner = 0;
      tie = false;
      player = 1;
      boardData = 
      [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
      ];
      gameOutcomeText.textContent = "";
      resetMarkers();
    }

    // Function for resetting the markers after a game is finished
    const resetMarkers = () => {
      grid.forEach(cell => {
        cell.className = "cell"
      })
    };

    // 
    // 
    // R: What is this part below?
    // 
    return {
      init
    };
})();


const createPlayer = () => {

    const updateScore = (winner) => {
      const playerOneScoreHtml = document.querySelector(".playerOneScore");
      const playerTwoScoreHtml = document.querySelector(".playerTwoScore");
      
      let playerOneScore = 0;
      let playerTwoScore = 0;

      playerOneScoreHtml.innerHTML = "Score: " + playerOneScore;
      playerTwoScoreHtml.innerHTML = "Score: " + playerTwoScore;

      if (winner == 1) {
        playerOneScore ++
      } else if (winner == -1) {
        playerTwoScore ++
      }
    };

    const init = (playerOneName, playerTwoName) => {
      const playerOneHtml = document.querySelector(".playerOneName");
      const playerTwoHtml = document.querySelector(".playerTwoName");
      playerOneHtml.innerHTML = playerOneName;
      playerTwoHtml.innerHTML = playerTwoName;
      updateScore();
    }

    return {updateScore, init}
};

// Helper functions
function add(counter, a) {
  return counter + a;
} 


// Draw game grid
gameBoard.init();



// Test area
