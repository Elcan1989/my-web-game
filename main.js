const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");

const rows = 15;
const cols = 15;
const cellSize = canvas.width / cols;

let maze = [];
let player = { x: 0, y: 0 };
let exit = { x: cols - 1, y: rows - 1 };

function generateMaze() {
  // 使用簡單的隨機牆壁生成迷宮
  maze = Array(rows)
    .fill()
    .map(() =>
      Array(cols)
        .fill()
        .map(() => (Math.random() < 0.25 ? 1 : 0))
    );

  maze[0][0] = 0;
  maze[rows - 1][cols - 1] = 0;
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
  if (
    newX >= 0 &&
    newX < cols &&
    newY >= 0 &&
    newY < rows &&
    maze[newY][newX] === 0
  ) {
    player.x = newX;
    player.y = newY;
    drawMaze();
    checkWin();
  }
}

function checkWin() {
  if (player.x === exit.x && player.y === exit.y) {
    statusText.textContent = "🎉 恭喜！你成功走出迷宮！";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});

function startGame() {
  generateMaze();
  player = { x: 0, y: 0 };
  drawMaze();
  statusText.textContent = "";
}

startGame();
