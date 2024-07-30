//get the empty element
let board = document.getElementById("board");
let gameOver = false;

//initial default set
let player1 = "X";
let player2 = "O";

//attach to option O
function playerChoice() {
  player1 = "O";
  player2 = "X";
  
  showScreen2();
}

let screen1 = document.getElementById('screen1');
let screen2 = document.getElementById('screen2');

// Function to switch from screen1 to screen2 with fade effect
function showScreen2() {

  // Add hidden class to screen1 to start fade-out
  screen1.classList.remove('visible');
  screen1.classList.add('hidden');

  // After the transition duration, hide screen1 and show screen2
  setTimeout(function() {
    screen1.style.display = 'none';
    screen2.style.display = 'block';

    // Add visible class to screen2 to start fade-in
    screen2.classList.remove('hidden');
    screen2.classList.add('visible');
  }, 500); // Match the timeout duration to the CSS transition duration

  
}

//Generate the board
function createBoard() {
  for (let box = 0; box < 9; box++) {
    let tictactoeBox = document.createElement("div");
    tictactoeBox.classList.add("cell");
    tictactoeBox.setAttribute("id", `box${box}`);
    tictactoeBox.setAttribute("data-box", box);
    board.append(tictactoeBox);

    // Pass the box number to the addMove function
    tictactoeBox.addEventListener("click", () => {
      addMove(`box${box}`, box);
    });
  }
}

var gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let gameState = [];
var moves = 0; //counting the moves made

// declaring the if/else outside 
let playerTurn1 = true;
//subtitle - the player declaration 
const subtitle = document.getElementById("subtitle");

function addMove(elementID, boxNumber) {
  
  if (gameOver) {
    return;
  }
  
  let specificBox = document.getElementById(elementID);
  if (!specificBox.textContent) {
    if (playerTurn1) {
      specificBox.textContent = player1;
      playerTurn1 = false;
      subtitle.innerHTML = `> Player ${player2}`; //on player 1, declare player 2
      document.body.style.backgroundColor = "#89cff0"; //change to blue
      board.style.outlineColor = "#89cff0"; //change to blue
    } else {
      specificBox.textContent = player2;
      playerTurn1 = true;
      subtitle.innerHTML = `> Player ${player1}`;
      document.body.style.backgroundColor = "#ED96A2"; //change to pink
      board.style.outlineColor = "#ED96A2"; //change to pink
    }
  }
  recordGame(specificBox, boxNumber);
  moves++;
  checkWinner();
}

function recordGame(specificBox, boxNumber) {
  let row = Math.floor(boxNumber / 3);
  let column = boxNumber % 3;

  gameBoard[row][column] = specificBox.textContent;
  let currentState = JSON.parse(JSON.stringify(gameBoard));
  gameState.push(currentState);
}

function checkWinner() {
  //this var needs to be inside as the game updates
  const winPatterns = [
    // Rows
    [gameBoard[0][0], gameBoard[0][1], gameBoard[0][2]],
    [gameBoard[1][0], gameBoard[1][1], gameBoard[1][2]],
    [gameBoard[2][0], gameBoard[2][1], gameBoard[2][2]],
    // Columns
    [gameBoard[0][0], gameBoard[1][0], gameBoard[2][0]],
    [gameBoard[0][1], gameBoard[1][1], gameBoard[2][1]],
    [gameBoard[0][2], gameBoard[1][2], gameBoard[2][2]],
    // Diagonals
    [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]],
    [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]]
  ];

  //iterate over each array in the winPatterns array
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern; //deconstruct inside

    //if all pieces in the array match each other, declare winner
    if (a && a === b && a === c) {
      subtitle.innerHTML = `Player ${a} wins!`;
      endGame();
      gameOver = true;
      return;
    }
  }

  if (moves === 9) {
    subtitle.innerHTML = "It's a draw!";
    endGame();
    gameOver = true;
  }
}

const buttons = document.getElementsByClassName("buttons");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const status = document.getElementById("status");

var displayState = 0;

//display the buttons 
function endGame() {
  status.innerHTML = moves;
  displayState = moves;
  next.style.opacity = "0.5";

  for (let button of buttons) {
    button.style.opacity = "1";
  }

  //If moves is even, player 2 won, and if odd, player 1 won
  if (moves % 2 === 0) {
    console.log("player 2 won");

    //set winning player standard color
    document.body.style.backgroundColor = "#89cff0"; //change to blue
    board.style.outlineColor = "#89cff0"; //change to blue
  } else {
    console.log ("player 1 won");
    document.body.style.backgroundColor = "#ED96A2"; //change to pink
    board.style.outlineColor = "#ED96A2"; //change to pink
  }
}

function previousMove() {
  //for the last possible previous move
  if (displayState === 2) {
    document.getElementById("previous").style.opacity = "0.5";
    updateBoard(gameState[displayState-1]);
  }
  //end of the previous
  if (displayState === 1) {
    return;
  } else {
    displayState--;
    status.innerHTML = displayState;
    console.log("Prev board with state:", gameState[displayState]);
    updateBoard(gameState[displayState-1]);

    next.style.opacity = "1";
  }
}

function nextMove() {
  //last possible next move
  if(displayState === moves-1) {
     document.getElementById("next").style.opacity = "0.5";
    updateBoard(gameState[displayState-1]);
  }
  //end of the next
  if (displayState === moves) {
    return;
  } else {
    displayState++;
    status.innerHTML = displayState;
    previous.style.opacity = "1";

    console.log("state:", gameState[displayState-1]);
    updateBoard(gameState[displayState-1]);

  }
}

function updateBoard(state) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let boxNumber = row * 3 + col;
      let specificBox = document.getElementById(`box${boxNumber}`);
      specificBox.textContent = state[row][col];
    }
  }
}


//resetting the board, resetting the text and colors
function resetBoard() {
  //clearing the board
  for (i = 0; i < 9; i++) {
    let specificBox = document.getElementById(`box${i}`);
    specificBox.textContent = "";
  }

  //hiding the buttons again
  for (let button of buttons) {
    button.style.opacity = "0";
  }

  gameOver = false;
  gameState = [];
  moves = 0;
  gameBoard = [["", "", ""], ["", "", ""], ["", "", ""]];

  playerTurn1 = true;
  subtitle.innerHTML = `> Player ${player1}`;
  document.body.style.backgroundColor = "#ED96A2";
  board.style.outlineColor = "#ED96A2";
  status.innerHTML = "";
}

createBoard();


