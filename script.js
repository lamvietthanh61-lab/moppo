let clickCount = 0;
let startTime = 0;
let duration = 0;
let interval;
let clickTimes = [];
let cpsHistory = [];

const clickArea = document.getElementById("clickArea");
const result = document.getElementById("result");
const sound = document.getElementById("clickSound");

/* ===== DARK MODE ===== */
function toggleMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

/* ===== THEME ===== */
function setTheme(t) {
  document.body.className = "";
  if (t) {
    document.body.classList.add(t);
    localStorage.setItem("theme", t);
  } else localStorage.removeItem("theme");
}
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.body.classList.add(savedTheme);

/* ===== CUSTOM COLOR ===== */
function setCustomColor(c) {
  document.body.style.background = c;
  localStorage.setItem("customColor", c);
}
if (localStorage.getItem("customColor")) {
  document.body.style.background = localStorage.getItem("customColor");
}

/* ===== START ===== */
document.getElementById("timeSelect").onchange = e => {
  document.getElementById("customTime").style.display =
    e.target.value === "custom" ? "block" : "none";
};

function startTest() {
  clickCount = 0;
  clickTimes = [];
  cpsHistory = [];
  startTime = Date.now();

  const sel = document.getElementById("timeSelect").value;
  duration = sel === "custom"
    ? +document.getElementById("customTime").value
    : +sel;

  interval = setTimeout(endTest, duration * 1000);
}

/* ===== CLICK ===== */
clickArea.onclick = e => {
  if (!startTime) return;

  clickCount++;
  clickTimes.push(Date.now());

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = e.offsetX + "px";
  ripple.style.top = e.offsetY + "px";
  clickArea.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);

  const cps = clickCount / ((Date.now() - startTime) / 1000);
  cpsHistory.push(cps);
  playClickSound(cps);
  dynamicSpeedTheme(cps);
};

/* ===== END ===== */
function endTest() {
  startTime = 0;
  const cps = clickCount / duration;

  if (detectCheat()) {
    alert("🚫 Phát hiện auto click!");
    return;
  }

  const rank = getRank(cps);
  result.innerText = `CPS: ${cps.toFixed(2)} | Rank: ${rank}`;
  showRank(rank);
  applyRankTheme(cps);
  saveProfile(cps, rank);
}

/* ===== RANK ===== */
function getRank(cps) {
  if (cps < 5) return "Bronze";
  if (cps < 7) return "Silver";
  if (cps < 9) return "Gold";
  return "Diamond";
}
function applyRankTheme(cps) {
  document.body.classList.remove("bronze","silver","gold","diamond");
  document.body.classList.add(getRank(cps).toLowerCase());
}
function showRank(r) {
  const d = document.createElement("div");
  d.className = "rank-popup";
  d.innerText = "🏆 " + r;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),2000);
}

/* ===== SOUND ===== */
function playClickSound(cps) {
  sound.playbackRate = Math.min(2, 0.8 + cps / 10);
  sound.currentTime = 0;
  sound.play();
}

/* ===== SPEED THEME ===== */
function dynamicSpeedTheme(cps) {
  document.body.style.background =
    `hsl(${Math.min(120, cps*15)},70%,30%)`;
}

/* ===== PROFILE ===== */
function saveProfile(cps, rank) {
  const name = document.getElementById("playerName").value || "Anonymous";
  localStorage.setItem("profile", JSON.stringify({name,cps,rank}));
  document.getElementById("profile").innerHTML =
    `👑 ${name}<br>CPS: ${cps.toFixed(2)}<br>Rank: ${rank}`;
}

/* ===== ANTI CHEAT ===== */
function detectCheat() {
  if (clickTimes.length < 15) return false;
  let intervals = [];
  for (let i=1;i<clickTimes.length;i++)
    intervals.push(clickTimes[i]-clickTimes[i-1]);
  let avg = intervals.reduce((a,b)=>a+b)/intervals.length;
  let variance = intervals.reduce((a,b)=>a+(b-avg)**2,0)/intervals.length;
  return variance < 5;
}




