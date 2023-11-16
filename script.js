// Get canvas and context
const grid = document.getElementById("gamegrid");
const context = grid.getContext("2d");

// Constants
const cellSize = 20;
const numRows = grid.height / cellSize;
const numCols = grid.width / cellSize;

// Grid data
let cellValues = createRandomGrid();
let generationCount = 0;

// Create a random grid
function createRandomGrid() {
  const grid = [];
  for (let row = 0; row < numRows; row++) {
    const rowValues = [];
    for (let col = 0; col < numCols; col++) {
      rowValues.push(Math.round(Math.random()));
    }
    grid.push(rowValues);
  }
  return grid;
}

// Draw the grid
function drawGrid() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      context.fillStyle = cellValues[row][col] === 1 ? "black" : "white";
      context.fillRect(
        col * cellSize,
        row * cellSize,
        cellSize - 1,
        cellSize - 1
      );
    }
  }
}

// Update the grid based on Game of Life algorithm
function updateGrid() {
  const newCellValues = [];

  for (let row = 0; row < numRows; row++) {
    const newRowValues = [];
    for (let col = 0; col < numCols; col++) {
      const neighbours = countNeighbours(row, col);
      if (cellValues[row][col] === 1) {
        newRowValues.push(neighbours === 2 || neighbours === 3 ? 1 : 0); //survive
      } else {
        newRowValues.push(neighbours === 3 ? 1 : 0); //born or die
      }
    }
    newCellValues.push(newRowValues);
  }

  cellValues = newCellValues;
  drawGrid();

  // Increment the generation count
  generationCount++;
  updateGenerationCountDisplay();
}

// Count cell's neighbours
function countNeighbours(row, col) {
  let count = 0;

  const neighbours = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dx, dy] of neighbours) {
    const newRow = row + dx;
    const newCol = col + dy;

    if (
      newRow >= 0 &&
      newRow < numRows &&
      newCol >= 0 &&
      newCol < numCols &&
      cellValues[newRow][newCol] === 1
    ) {
      count++;
    }
  }

  return count;
}

// For game loop
let intervalId;
let defaultSpeed = 500;

// DOM elements
const speedDisplay = document.getElementById("speed");
const generationCountDisplay = document.getElementById("generationCount");

// Start the game
function startGame() {
  if (generationCount > 0) stopGame();
  if (!intervalId) {
    intervalId = setInterval(updateGrid, defaultSpeed);
  }
}

// Stop the game
function stopGame() {
  clearInterval(intervalId);
  intervalId = null;
}

// Reload the grid with a random configuration
function reloadGrid() {
  cellValues = createRandomGrid();
  drawGrid();
  generationCount = 0;
  updateGenerationCountDisplay();
}

// Clear the grid
function clearGrid() {
  cellValues = createEmptyGrid();
  drawGrid();
  generationCount = 0;
  updateGenerationCountDisplay();
}

// Create an empty grid
function createEmptyGrid() {
  const grid = [];
  for (let row = 0; row < numRows; row++) {
    const rowValues = new Array(numCols).fill(0);
    grid.push(rowValues);
  }
  return grid;
}

// Change game speed
// Decrease
function increaseSpeed() {
  defaultSpeed += 50;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = setInterval(updateGrid, defaultSpeed);
  }
  speedDisplay.textContent = `${defaultSpeed}ms`;
}
// Increase
function decreaseSpeed() {
  if (defaultSpeed > 50) {
    defaultSpeed -= 50;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = setInterval(updateGrid, defaultSpeed);
    }
    speedDisplay.textContent = `${defaultSpeed}ms`;
  }
}

// Update the generation count display
function updateGenerationCountDisplay() {
  if (generationCountDisplay) {
    generationCountDisplay.textContent = generationCount;
  }
}

// Initial display of generation count and speed
updateGenerationCountDisplay();
speedDisplay.textContent = `${defaultSpeed}ms`;

// Event listener to toggle cell state on click event
grid.addEventListener("click", function (event) {
  const rect = grid.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const clickedRow = Math.floor(y / cellSize);
  const clickedCol = Math.floor(x / cellSize);

  cellValues[clickedRow][clickedCol] = 1 - cellValues[clickedRow][clickedCol];

  drawGrid();
});
