let clicks = 0;
let timeLeft = 0;
let duration = 0;
let timer = null;
let started = false;
let firstClick = false;

let clickTimes = [];
let clicksPerSecond = [];
let lastClickTime = 0;
let cheatDetected = false;

let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
renderBoard();

/* ===== TIME ===== */
function getSelectedTime() {
  const select = document.getElementById("timeSelect");
  if (select.value === "custom") {
    const custom = parseInt(document.getElementById("customTime").value);
    if (!custom || custom < 1) {
      alert("Thời gian phải >= 1 giây");
      return null;
    }
    return custom;
  }
  return parseInt(select.value);
}

/* ===== START ===== */
function startTest() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) {
    alert("Nhập tên người chơi!");
    return;
  }

  duration = getSelectedTime();
  if (!duration) return;

  clicks = 0;
  timeLeft = duration;
  clicksPerSecond = new Array(duration).fill(0);
  clickTimes = [];
  cheatDetected = false;
  firstClick = false;
  started = true;

  document.getElementById("clicks").innerText = 0;
  document.getElementById("time").innerText = duration;
  document.getElementById("clickArea").style.display = "flex";
  document.getElementById("startBtn").disabled = true;
}

/* ===== CLICK ===== */
function registerClick() {
  if (!started) return;

  const now = Date.now();

  /* 🧠 ANTI CHEAT */
  if (lastClickTime && now - lastClickTime < 30) {
    cheatDetected = true;
  }
  lastClickTime = now;

  if (!firstClick) {
    firstClick = true;
    startTimer();
  }

  if (timeLeft > 0) {
    clicks++;
    document.getElementById("clicks").innerText = clicks;

    const secondIndex = duration - timeLeft;
    if (secondIndex < clicksPerSecond.length) {
      clicksPerSecond[secondIndex]++;
    }
  }
}

/* ===== TIMER ===== */
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

/* ===== END ===== */
function endTest() {
  clearInterval(timer);
  started = false;

  document.getElementById("clickArea").style.display = "none";
  document.getElementById("startBtn").disabled = false;

  if (cheatDetected) {
    alert("🚫 Phát hiện auto click!\nBài test bị huỷ.");
    return;
  }

  const cps = (clicks / duration).toFixed(2);
  const name = document.getElementById("playerName").value.trim();

  leaderboard.push({ name, cps });
  leaderboard.sort((a, b) => b.cps - a.cps);
  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderBoard();

  const rank =
    leaderboard.findIndex(p => p.name === name && p.cps === cps) + 1;

  alert(
    `⏱ HẾT GIỜ!\n⚡ CPS: ${cps}\n🏆 Xếp hạng: #${rank}`
  );

  drawChart();
}

/* ===== LEADERBOARD ===== */
function renderBoard() {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  leaderboard.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerText = `#${i + 1} ${p.name} - ${p.cps} CPS`;
    list.appendChild(li);
  });
}

/* ===== CHART ===== */
function drawChart() {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const max = Math.max(...clicksPerSecond, 1);
  const barWidth = canvas.width / clicksPerSecond.length;

  clicksPerSecond.forEach((value, i) => {
    const height = (value / max) * canvas.height;
    ctx.fillStyle = "#3498db";
    ctx.fillRect(
      i * barWidth,
      canvas.height - height,
      barWidth - 2,
      height
    );
  });
}

