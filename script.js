const grid = document.getElementById("gamegrid");
const context = grid.getContext("2d");
const cellSize = 20;
const numRows = grid.height / cellSize;
const numCols = grid.width / cellSize;
let cellValues = createRandomGrid();

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

function updateGrid() {
  const newCellValues = [];

  for (let row = 0; row < numRows; row++) {
    const newRowValues = [];
    for (let col = 0; col < numCols; col++) {
      const neighbours = countNeighbours(row, col);
      if (cellValues[row][col] === 1) {
        newRowValues.push(neighbours === 2 || neighbours === 3 ? 1 : 0);
      } else {
        newRowValues.push(neighbours === 3 ? 1 : 0);
      }
    }
    newCellValues.push(newRowValues);
  }

  cellValues = newCellValues;
  drawGrid();
}

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

    if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
      if (cellValues[newRow][newCol] === 1) {
        count++;
      }
    }
  }

  return count;
}

let intervalId;

function startGame() {
  // Clear the previous interval (if it exists)
  stopGame();
  intervalId = setInterval(updateGrid, 500);
}

function stopGame() {
  clearInterval(intervalId);
}

function clearGrid() {
  cellValues = createRandomGrid();
  drawGrid();
}

drawGrid();
