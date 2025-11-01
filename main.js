const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");
const levelDisplay = document.getElementById("levelDisplay");

let maze = [];
let player = { x: 1, y: 1 };
let exit = { x: 0, y: 0 };
let level = 10000000000;
let cellSize;
let rows, cols;

function createEmptyMaze() {
  maze = Array(rows)
    .fill()
    .map(() => Array(cols).fill(1));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateMaze() {
  createEmptyMaze();

  function carve(x, y) {
    const directions = shuffle([
      [0, -2],
      [2, 0],
      [0, 2],
      [-2, 0],
    ]);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1 && maze[ny][nx] === 1) {
        maze[ny][nx] = 0;
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  maze[1][1] = 0;
  carve(1, 1);
  maze[exit.y][exit.x] = 0;
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = "gray";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // 出口
  ctx.fillStyle = "gold";
  ctx.fillRect(exit.x * cellSize, exit.y * cellSize, cellSize, cellSize);

  // 玩家
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x * cellSize + 4, player.y * cellSize + 4, cellSize - 8, cellSize - 8);
}

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (maze[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
    drawMaze();
    checkWin();
  }
}

function checkWin() {
  if (player.x === exit.x && player.y === exit.y) {
    statusText.textContent = `🎉 通過第 ${level} 關！按 [空白鍵] 進入下一關`;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
  if (e.key === " " && player.x === exit.x && player.y === exit.y) {
    nextLevel();
  }
});

function startGame() {
  rows = 15 + level * 2; // 每關迷宮更大
  cols = 15 + level * 2;
  cellSize = canvas.width / cols;

  player = { x: 1, y: 1 };
  exit = { x: cols - 2, y: rows - 2 };
  statusText.textContent = "";

  generateMaze();
  drawMaze();
  levelDisplay.textContent = `第 ${level} 關`;
}

function nextLevel() {
  level++;
  startGame();
}

startGame();
