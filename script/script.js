// This is a module.
// Use a module because there is only one of these objects.
// Try to declare all variables in the function they need to be in.
const GameBoard = (() => {
    const grid = document.querySelectorAll(".cell");
    let playAgainstPcMode = false;

    const init = () => {
        const submitBtn = document.querySelector(".submit");
        const playPcBtn = document.querySelector(".playPcBtn");
        const playHumanBtn = document.querySelector(".playHumanBtn");
        const playModeContainer = document.querySelector(".playModeContainer")

        // For some reason I have to hide the cells here.
        // Setting display none in css doesn't work.
        grid.forEach(cell => {
            cell.style.display = "none"
        });

        // Event listeners for play mode selection
        playPcBtn.addEventListener('click', () => {
            playModeContainer.style.display = "none";
            updateForm(playPcBtn);
            GameLogic.init(true);
            playAgainstPcMode = true;
        });
        playHumanBtn.addEventListener('click', () => {
            playModeContainer.style.display = "none";
            updateForm(playHumanBtn);
            GameLogic.init(false);
        });

        // Set event listener for form validation.
        // Check turn cannot be called until the form validation is complete.
        // Once form validation returns true, init players using 
        // the names from the form.
        submitBtn.addEventListener('click', () => {
            updateForm(submitBtn);
        });

        // Create restart button
        restartButton = document.querySelector(".restartBtn");
        gameEndInfo = document.querySelector(".restartContainer");
        restartButton.addEventListener("click", () => {
            gameEndInfo.style.display = "none";
            GameLogic.restartGame();
        });

        GameLogic.checkTurn(grid);
    };

    const updateForm = (btnPressed) => {
        const form = document.querySelector("#playerForm");

        if (btnPressed.classList.value == "playPcBtn") {
            form.style.display = "flex";
            playerTwo.value = "Killer AI";
            playerTwo.style.display = "none";
            playerTwoLabel.style.display = "none";
            playerOneLabel.innerHTML = "Player Name";
        } else if (btnPressed.classList.value == "playHumanBtn") {
            form.style.display = "flex";
        }

        if (hasFormBeenCompleted(form)) {
                Players.showPlayerInfo(playerOne.value, playerTwo.value);
        };
    }

    const hasFormBeenCompleted = (form) => {
        if (validationCheck() == true) {
            form.style.display = "none";
            grid.forEach(cell => {
                cell.style.display = "";
            });
            return true
        };
    };

    // Validation check on both names.
    const validationCheck = () => {
        if (!playAgainstPcMode) {
            if (playerOne.value.match("^[A-Za-z]{1,100}") &&
                playerTwo.value.match("^[A-Za-z]{1,100}")) {
                return true
            } else {
                return false
            };
        } else if (playAgainstPcMode) {
            if (playerOne.value.match("^[A-Za-z]{1,100}")) {
                return true
            } else {
                return false
            };
        };
    };

    // Function for drawing the markers on the game board
    const drawMarkers = (boardData) => {
        const board = document.querySelector(".board");
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                if (boardData[i][j] == 1) {
                    board.children[(i * 3) + j].classList.add("x");
                    board.children[(i * 3) + j].classList.remove("xHover");
                } else if (boardData[i][j] == -1) {
                    board.children[(i * 3) + j].classList.add("circle");
                    board.children[(i * 3) + j].classList.remove("circleHover");
                };
            };
        };
    };

    const showWinner = (winner) => {
        gameOutcomeText = document.querySelector(".gameOutcome");

        gameEndInfo.style.display = "flex";
        if (winner == 1) {
            gameOutcomeText.textContent = playerOne.value + ` Wins!!`;
        } else if (winner == -1) {
            gameOutcomeText.textContent = playerTwo.value + ` Wins!!`;
        } else if (winner == 0) {
            gameOutcomeText.textContent = "It's a Tie!";
        };
    };

    // Function for resetting the markers after a game is finished
    const resetMarkers = () => {
        grid.forEach(cell => {
            cell.className = "cell"
        })
    };

    return {
        init, drawMarkers, showWinner, resetMarkers
    };
})();

const GameLogic = (() => {
    let boardData =
        [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

    let playerOneTurn = true;
    let playAgainstPc = false;

    const init = (playMode) => {
        if (playMode == true) {
            playAgainstPc = true
        } else {
            playAgainstPc = false
        };
    };


    // Function for checking which cell has been clicked
    // Index (cellClickedValue) returns the number of which cell is clicked
    const checkTurn = (grid) => {
        let hasMouseLeftCell = true;
        grid.forEach((cell, cellClickedValue) => {
            cell.addEventListener('mouseenter', () => {
                hoverEffect(cell, false);
            });
            cell.addEventListener('mouseleave', () => {
                hoverEffect(cell, hasMouseLeftCell);
            });
            cell.addEventListener('click', () => {
                takeTurn(cellClickedValue);
            });
        });
    };

    const hoverEffect = (cell, hasMouseLeftCell) => {
        if (!hasMouseLeftCell) {
            if (playerOneTurn && cell.classList != "cell circle"
                && cell.classList != "cell x") {
                cell.classList.add("xHover");
            } else if (
                !playerOneTurn && cell.classList != "cell x"
                && cell.classList != "cell circle") {
                cell.classList.add("circleHover");
            };
        };
        if (hasMouseLeftCell) {
            if (playerOneTurn) {
                cell.classList.remove("xHover");
            } else if (!playerOneTurn) {
                cell.classList.remove("circleHover");
            }
        };
    };

    const takeTurn = (cellClickedValue) => {
        // Remainder 3 gives us the row because we have a 3x3 grid
        let row = cellClickedValue % 3;
        let col = (cellClickedValue - row) / 3;
        if (!playAgainstPc) {
            if (playerOneTurn) {
                if (boardData[col][row] == 0) {
                    boardData[col][row] = 1;
                    playerOneTurn = false;
                };
            } else if (!playerOneTurn) {
                if (boardData[col][row] == 0) {
                    boardData[col][row] = -1;
                    playerOneTurn = true;
                };
            };
            GameBoard.drawMarkers(boardData);
        } else if (playAgainstPc) {
            if (boardData[col][row] == 0) {
                boardData[col][row] = 1;
            };
            //GameBoard.drawMarkers(boardData);
            // AI takes it's turn, updates the board data and returns the updated data
            boardData = AI.aiTakeTurn(boardData);
            GameBoard.drawMarkers(boardData);
        }

        // Check to see if the game is over
        checkGameOver();
    };

    // Function to check the winner
    const checkGameOver = () => {
        let winner = 2;

        // Check rows and columns
        for (i = 0; i < boardData.length; i++) {
            let rowSum = boardData[i][0] + boardData[i][1] + boardData[i][2];
            let colSum = boardData[0][i] + boardData[1][i] + boardData[2][i];
            // Check if all X or all O in any rows or columns
            if (rowSum == 3 || colSum == 3) {
                winner = 1;
            } else if (rowSum == -3 || colSum == -3) {
                winner = -1;
            }
        }

        // Check diagonals
        let diagonalSum1 = boardData[0][0] + boardData[1][1] + boardData[2][2]
        let diagonalSum2 = boardData[0][2] + boardData[1][1] + boardData[2][0]
        if (diagonalSum1 == 3 || diagonalSum2 == 3) {
            winner = 1;
        } else if (diagonalSum1 == -3 || diagonalSum2 == -3) {
            winner = -1;
        }

        // Check for a tie
        if (boardData[0].indexOf(0) == -1 &&
            boardData[1].indexOf(0) == -1 &&
            boardData[2].indexOf(0) == -1) {
            winner = 0;
        };

        // If there is a winner or a tie, update the score and show the winner info
        if (winner < 2) {
            Players.updateWinner(winner);
            GameBoard.showWinner(winner);
        }
    };

    const restartGame = () => {
        // reset game variables
        winner = 2;
        playerOneTurn = true;
        boardData =
            [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];
        GameBoard.resetMarkers();
    }
    return { checkTurn, init, restartGame };
})();

// Use an IIFE so the player object is initialized.
// Now we can access anything this object returns.
const Players = (() => {
    let playerOneScore = 0;
    let playerTwoScore = 0;


    const updateScore = (winner) => {
        const playerOneScoreHtml = document.querySelector(".playerOneScore");
        const playerTwoScoreHtml = document.querySelector(".playerTwoScore");

        if (winner == 1) {
            playerOneScore++
        } else if (winner == -1) {
            playerTwoScore++
        }

        playerOneScoreHtml.innerHTML = "Score: " + playerOneScore;
        playerTwoScoreHtml.innerHTML = "Score: " + playerTwoScore;

    };

    // Create 2 players using the arguments from the form.
    // Show player names and then run update score.
    const showPlayerInfo = (playerOneName, playerTwoName) => {
        const playerOneHtml = document.querySelector(".playerOneName");
        const playerTwoHtml = document.querySelector(".playerTwoName");

        playerOneHtml.innerHTML = playerOneName;
        playerTwoHtml.innerHTML = playerTwoName;

        updateScore();
        return playerOneName
    }

    const updateWinner = (winner) => {
        switch (winner) {
            case 1:
                { updateScore(1) };
                break;
            case -1:
                { updateScore(-1) };
                break;
            case 0:
                // Score doesn't need updating if it's a draw so we leave blank.
                { };
                break;
        }
    }

    return { showPlayerInfo, updateWinner }
})();

// Minimax AI
const AI = (() => {
    const aiTakeTurn = (boardData) => {
        let newBoardData = aiAlgo(boardData);
        return newBoardData
    };

    const aiAlgo = (boardData) => {
        let markPlacement = returnColAndRow();
        
        // Check if board has a 0 in the location returned by markPlacement
        if (boardData[markPlacement[0]][markPlacement[1]] == 0) {
            boardData[markPlacement[0]][markPlacement[1]] = -1;
            return boardData
        } else if (
            boardData[markPlacement[0]][markPlacement[1]] != 0) {
        };
    }

    const returnColAndRow = () => {
        let rowAndCol = [];

        rowAndCol.push(Math.floor(Math.random() * 3));
        rowAndCol.push(Math.floor(Math.random() * 3));

        return rowAndCol
    }
    return { aiTakeTurn };
})();

// Draw game grid
GameBoard.init();