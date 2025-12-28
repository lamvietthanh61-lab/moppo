/* ================= FIREBASE ================= */
const firebaseConfig = {
apiKey: "AIzaSyBvkk0gXU0uNDUMUsOXo0_NFAmXpNZY89A",
authDomain: "cps-test-d52b4.firebaseapp.com",
projectId: "cps-test-d52b4",
storageBucket: "cps-test-d52b4.firebasestorage.app",
messagingSenderId: "315180666784",
appId: "1:315180666784:web:c18455a6c4a9d3c8561ec5"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
/* ===== GAME STATE ===== */
let clicks = 0;
let started = false;
let startTime = 0;
let duration = 0;
let clickTimes = [];

/* ===== TIME SELECT ===== */
timeSelect.onchange = () => {
  customTime.style.display = timeSelect.value === "custom" ? "inline" : "none";
};

/* ===== START ===== */
function prepareGame() {
  clicks = 0;
  clickTimes = [];
  started = false;

  clickArea.style.display = "flex";
  result.innerText = "👉 Bấm vào ô để bắt đầu!";
  startBtn.disabled = true;
}

/* ===== CLICK ===== */
clickArea.onclick = e => {
  rippleEffect(e);

  if (!started) {
    started = true;
    startTime = Date.now();
    duration =
      timeSelect.value === "custom"
        ? Number(customTime.value) * 1000
        : Number(timeSelect.value) * 1000;
  }

  clicks++;
  recordClick();

  if (Date.now() - startTime >= duration) endGame();
};

/* ===== END GAME ===== */
function endGame() {
  started = false;
  startBtn.disabled = false;

  const cps = (clicks / (duration / 1000)).toFixed(2);

  if (detectAutoClick()) {
    alert("🚫 Phát hiện auto click!");
    return;
  }

  result.innerText = `⚡ CPS: ${cps}`;

  const rank = getRank(cps);
  showRank(rank);
  applyRankTheme(cps);

  const name = playerName.value || "Guest";
  saveProfile(name, cps, rank);
  submitScore(name, Number(cps));

  loadProfile();
  loadGlobalLeaderboard();
}

/* ===== RANK ===== */
function getRank(cps) {
  if (cps < 5) return "Bronze";
  if (cps < 7) return "Silver";
  if (cps < 9) return "Gold";
  return "Diamond";
}

function showRank(rank) {
  const p = document.createElement("div");
  p.className = "rank-popup";
  p.innerText = "🏆 " + rank;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 2000);
}

function applyRankTheme(cps) {
  document.body.className = getRank(cps).toLowerCase();
}

/* ===== PROFILE ===== */
function saveProfile(name, cps, rank) {
  localStorage.setItem("profile", JSON.stringify({ name, cps, rank }));
}

function loadProfile() {
  const p = JSON.parse(localStorage.getItem("profile"));
  if (!p) return;
  profile.innerHTML = `👤 ${p.name}<br>⚡ ${p.cps} CPS<br>🏆 ${p.rank}`;
}
loadProfile();

/* ===== LEADERBOARD ===== */
async function submitScore(name, cps) {
  await db.collection("leaderboard").add({ name, cps });
}

async function loadGlobalLeaderboard() {
  globalLeaderboard.innerHTML = "";
  const snap = await db.collection("leaderboard")
    .orderBy("cps", "desc")
    .limit(10)
    .get();

  let i = 1;
  snap.forEach(d => {
    const li = document.createElement("li");
    li.innerText = `#${i++} ${d.data().name} — ${d.data().cps} CPS`;
    globalLeaderboard.appendChild(li);
  });
}
loadGlobalLeaderboard();

/* ===== ANTI CHEAT ===== */
function recordClick() {
  clickTimes.push(Date.now());
  if (clickTimes.length > 30) clickTimes.shift();
}

function detectAutoClick() {
  if (clickTimes.length < 10) return false;
  const diffs = clickTimes.slice(1).map((t, i) => t - clickTimes[i]);
  const avg = diffs.reduce((a, b) => a + b) / diffs.length;
  const variance = diffs.reduce((a, b) => a + (b - avg) ** 2, 0) / diffs.length;
  return variance < 5;
}

/* ===== EFFECT ===== */
function rippleEffect(e) {
  const r = document.createElement("span");
  r.className = "ripple";
  r.style.left = e.offsetX + "px";
  r.style.top = e.offsetY + "px";
  clickArea.appendChild(r);
  setTimeout(() => r.remove(), 600);
}

/* ===== DARK MODE ===== */
function toggleMode() {
  document.body.classList.toggle("dark");
}









