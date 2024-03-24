const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

const params = new URL(document.location).searchParams;
const rectWidth = parseInt(params.get("rw") ?? 400);
const rectHeight = parseInt(params.get("rh") ?? 300);
const radius = parseInt(params.get("r") ?? 100);
const rectCX = CANVAS_WIDTH / 2;
const rectCY = CANVAS_HEIGHT / 2;
const rectWidthHalf = rectWidth / 2;
const rectHeightHalf = rectHeight / 2;
const rectLeft = rectCX - rectWidthHalf;
const rectRight = rectCX + rectWidthHalf;
const rectTop = rectCY - rectHeightHalf;
const rectBottom = rectCY + rectHeightHalf;

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

canvas.onclick = (e) => {
  const cx = e.offsetX;
  const cy = e.offsetY;

  draw();

  const result = detectCollision(cx, cy);
  if (result.collides) {
    ctx.strokeStyle = "green";
  } else {
    ctx.strokeStyle = "red";
  }

  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.strokeRect(cx, cy, 1, 1);

  ctx.font = "30px Arial";
  ctx.strokeText(result.message, 10, CANVAS_HEIGHT - 10);
};

draw();

function draw() {
  ctx.fillStyle = "#202020";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw rectangle
  ctx.strokeStyle = "coral";
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.rect(rectLeft, rectTop, rectWidth, rectHeight);
  ctx.stroke();

  // Draw bounding rectangle
  ctx.strokeStyle = "#6A5ACD";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.rect(
    rectLeft - radius,
    rectTop - radius,
    rectWidth + 2 * radius,
    rectHeight + 2 * radius,
  );
  ctx.stroke();

  // Draw corner boundaries
  ctx.moveTo(rectLeft, rectTop - radius);
  ctx.lineTo(rectLeft, rectTop);
  ctx.lineTo(rectLeft - radius, rectTop);
  ctx.moveTo(rectRight, rectTop - radius);
  ctx.lineTo(rectRight, rectTop);
  ctx.lineTo(rectRight + radius, rectTop);
  ctx.moveTo(rectRight + radius, rectBottom);
  ctx.lineTo(rectRight, rectBottom);
  ctx.lineTo(rectRight, rectBottom + radius);
  ctx.moveTo(rectLeft - radius, rectBottom);
  ctx.lineTo(rectLeft, rectBottom);
  ctx.lineTo(rectLeft, rectBottom + radius);
  ctx.stroke();

  // Draw collision border for circles with given radius
  ctx.strokeStyle = "teal";
  ctx.setLineDash([15, 5]);
  ctx.beginPath();
  ctx.arc(rectLeft, rectTop, radius, Math.PI, (3 * Math.PI) / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rectRight, rectTop, radius, (3 * Math.PI) / 2, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rectRight, rectBottom, radius, 0, Math.PI / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rectLeft, rectBottom, radius, Math.PI / 2, Math.PI);
  ctx.stroke();
}

function detectCollision(cx, cy) {
  const distX = Math.abs(cx - rectCX);
  const distY = Math.abs(cy - rectCY);

  if (distX > rectWidthHalf + radius || distY > rectHeightHalf + radius) {
    return { collides: false, message: "Outside bounding rectangle" };
  }

  if (distX <= rectWidthHalf || distY <= rectHeightHalf) {
    return {
      collides: true,
      message: "Inside collision border, but not in the corner",
    };
  }

  const distToCornerSqrd =
    (cx - rectCX - rectWidthHalf) ** 2 + (cy - rectCY - rectHeightHalf) ** 2;
  if (distToCornerSqrd <= radius ** 2) {
    return {
      collides: true,
      message: "Inside corner of collision border",
    };
  }

  return {
    collides: false,
    message:
      "Inside corner of bounding rectangle, but outside collision border",
  };
}
