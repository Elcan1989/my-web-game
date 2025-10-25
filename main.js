const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 200, y: 150, size: 20, color: "lime" };

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function update() {
  draw();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.y -= 10;
  if (e.key === "ArrowDown") player.y += 10;
  if (e.key === "ArrowLeft") player.x -= 10;
  if (e.key === "ArrowRight") player.x += 10;
});

update();
