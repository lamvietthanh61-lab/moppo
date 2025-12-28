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
/* ================= GAME STATE ================= */
let clickCount = 0;
let clickTimes = [];
let duration = 0;
let timer = null;

let gameReady = false;
let gameRunning = false;

/* ================= DOM ================= */
const clickArea = document.getElementById("clickArea");
const result = document.getElementById("result");
const leaderboardEl = document.getElementById("leaderboard");
const customInput = document.getElementById("customTime");
const select = document.getElementById("timeSelect");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

/* ================= SOUND ================= */
const clickSound = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-arcade-click-1115.mp3"
);

/* ================= RANK ================= */
const rankOrder = ["Beginner", "Normal", "Fast", "Pro", "God"];

function getRank(cps) {
  if (cps < 4) return "Beginner";
  if (cps < 6) return "Normal";
  if (cps < 8) return "Fast";
  if (cps < 10) return "Pro";
  return "God";
}

function applyRankTheme(rank) {
  document.body.dataset.rank = rank;
}

/* ================= TIME SELECT ================= */
select.onchange = () => {
  customInput.hidden = select.value !== "custom";
};

/* ================= START ================= */
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

/* ================= CLICK ================= */
clickArea.onclick = e => {
  if (!gameReady) return;

  if (!gameRunning) {
    gameRunning = true;
    timer = setTimeout(endTest, duration * 1000);
  }

  clickCount++;
  clickTimes.push(Date.now());

  playSound();

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = e.offsetX + "px";
  ripple.style.top = e.offsetY + "px";
  clickArea.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
};

/* ================= ANTI-CHEAT ================= */
function advancedCheatCheck() {
  if (clickTimes.length < 15) return false;

  let diffs = [];
  for (let i = 1; i < clickTimes.length; i++) {
    diffs.push(clickTimes[i] - clickTimes[i - 1]);
  }

  const avg = diffs.reduce((a,b)=>a+b) / diffs.length;
  const variance = diffs.reduce((a,b)=>a+(b-avg)**2,0) / diffs.length;

  return avg < 18 || variance < 5;
}

/* ================= PROFILE ================= */
function getProfile(cps) {
  const name = document.getElementById("playerName").value || "Guest";
  const rank = getRank(cps);
  return { name, rank };
}

/* ================= RANK UP ================= */
function checkRankUp(newRank) {
  const oldRank = localStorage.getItem("bestRank") || "Beginner";

  if (rankOrder.indexOf(newRank) > rankOrder.indexOf(oldRank)) {
    localStorage.setItem("bestRank", newRank);
    showRankUp(newRank);
  }
}

function showRankUp(rank) {
  const popup = document.getElementById("rankPopup");
  const text = document.getElementById("rankText");

  text.innerText = rank;
  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 2000);
}

/* ================= END ================= */
function endTest() {
  gameReady = false;
  gameRunning = false;

  const cps = clickCount / duration;

  if (advancedCheatCheck()) {
    result.innerText = "🚫 Phát hiện auto / macro";
    return;
  }

  const profile = getProfile(cps);

  applyRankTheme(profile.rank);
  checkRankUp(profile.rank);

  result.innerText =
    `🔥 CPS: ${cps.toFixed(2)} | Rank: ${profile.rank}`;

  uploadScore(cps, profile);
  drawChart();
}

/* ================= FIREBASE ================= */
function uploadScore(cps, profile) {
  db.collection("scores").add({
    name: profile.name,
    cps: cps,
    rank: profile.rank,
    time: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function loadOnlineLeaderboard() {
  db.collection("scores")
    .orderBy("cps", "desc")
    .limit(10)
    .onSnapshot(snap => {
      leaderboardEl.innerHTML = "";
      snap.forEach(doc => {
        const d = doc.data();
        const li = document.createElement("li");
        li.innerText = `${d.name} – ${d.cps.toFixed(2)} CPS`;
        leaderboardEl.appendChild(li);
      });
    });
}

/* ================= CHART ================= */
function drawChart() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  clickTimes.forEach((t,i) => {
    const x = (i / clickTimes.length) * canvas.width;
    const y = canvas.height - i * 3;
    ctx.lineTo(x,y);
  });
  ctx.stroke();
}

/* ================= SOUND ================= */
function playSound() {
  clickSound.playbackRate = Math.min(3, 1 + clickCount / 30);
  clickSound.currentTime = 0;
  clickSound.play();
}

/* ================= INIT ================= */
loadOnlineLeaderboard();









