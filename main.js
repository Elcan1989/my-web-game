const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");

const rows = 21;
const cols = 21;
const cellSize = canvas.width / cols;

let maze = [];
let player = { x: 1, y: 1 };
let exit = { x: cols - 2, y: rows - 2 };

// ---------- 迷宮生成 ----------
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

function carve(x, y) {
  const directions = shuffle([
    [0, -2], // 上
    [2, 0],  // 右
    [0, 2],  // 下
    [-2, 0], // 左
  ]);

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (
      nx > 0 &&
      nx < cols - 1 &&
      ny > 0 &&
      ny < rows - 1 &&
      maze[ny][nx] === 1
    ) {
      maze[ny][nx] = 0;
      maze[y + dy / 2][x + dx / 2] = 0;
      carve(nx, ny);
    }
  }
}

function generateMaze() {
  createEmptyMaze();
  maze[1][1] = 0;
  carve(1, 1);
  maze[exit.y][exit.x] = 0;
}

// ---------- 繪製 ----------
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
  ctx.fillRect(
    player.x * cellSize + 4,
    player.y * cellSize + 4,
    cellSize - 8,
    cellSize - 8
  );
}

// ---------- 玩家 ----------
function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;

  if (maze[newY] && maze[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
    drawMaze();
    checkWin();
  }
}

function checkWin() {
  if (player.x === exit.x && player.y === exit.y) {
    statusText.textContent = "🎉 恭喜逃出迷宮！按 R 重新挑戰";
  }
}

// ---------- 控制 ----------
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
  if (e.key.toLowerCase() === "r") startGame();
});

// ---------- 啟動 ----------
function startGame() {
  generateMaze();
  player = { x: 1, y: 1 };
  statusText.textContent = "";
  drawMaze();
}

startGame();

