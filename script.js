let clickCount = 0;
let clickTimes = [];
let startTime = 0;
let duration = 0;
let timer = null;

let gameReady = false;
let gameRunning = false;

const clickArea = document.getElementById("clickArea");
const result = document.getElementById("result");
const leaderboardEl = document.getElementById("leaderboard");
const customInput = document.getElementById("customTime");
const select = document.getElementById("timeSelect");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

select.onchange = () => {
  customInput.hidden = select.value !== "custom";
};

function startTest() {
  clickCount = 0;
  clickTimes = [];
  gameReady = true;
  gameRunning = false;

  duration = select.value === "custom"
    ? Number(customInput.value)
    : Number(select.value);

  result.innerText = "👉 Click vào ô vuông để bắt đầu";
}

clickArea.onclick = e => {
  if (!gameReady) return;

  if (!gameRunning) {
    gameRunning = true;
    startTime = Date.now();
    timer = setTimeout(endTest, duration * 1000);
  }

  clickCount++;
  clickTimes.push(Date.now());

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = e.offsetX + "px";
  ripple.style.top = e.offsetY + "px";
  clickArea.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
};

function detectCheat() {
  if (clickTimes.length < 10) return false;
  let intervals = [];
  for (let i = 1; i < clickTimes.length; i++) {
    intervals.push(clickTimes[i] - clickTimes[i - 1]);
  }
  const avg = intervals.reduce((a,b)=>a+b)/intervals.length;
  return avg < 20;
}

function endTest() {
  gameReady = false;
  gameRunning = false;

  const cps = clickCount / duration;

  if (detectCheat()) {
    result.innerText = "🚫 Auto click bị phát hiện";
    return;
  }

  result.innerText = `🔥 CPS: ${cps.toFixed(2)}`;
  saveScore(cps);
  drawChart();
}

function saveScore(cps) {
  const scores = JSON.parse(localStorage.getItem("scores") || "[]");
  scores.push(cps);
  scores.sort((a,b)=>b-a);
  localStorage.setItem("scores", JSON.stringify(scores.slice(0,10)));
  renderLeaderboard();
}

function renderLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("scores") || "[]");
  leaderboardEl.innerHTML = "";
  scores.forEach(s => {
    const li = document.createElement("li");
    li.innerText = s.toFixed(2);
    leaderboardEl.appendChild(li);
  });
}

function drawChart() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  clickTimes.forEach((t,i) => {
    const x = (i / clickTimes.length) * canvas.width;
    const y = canvas.height - i * 2;
    ctx.lineTo(x,y);
  });
  ctx.stroke();
}

renderLeaderboard();










