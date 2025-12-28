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
/* ===== Biến ===== */
let clicks = 0;
let started = false;
let duration;
let timer;
let lastClick = 0;
let lastRank = "";

/* ===== Elements ===== */
const startBtn = document.getElementById("startBtn");
const clickArea = document.getElementById("clickArea");
const info = document.getElementById("info");
const rankInfo = document.getElementById("rankInfo");
const leaderboard = document.getElementById("leaderboard");
const timeSelect = document.getElementById("timeSelect");
const customTime = document.getElementById("customTime");

/* ===== Country ===== */
let countryFlag = "🏳️";

fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(d => {
    countryFlag = getFlag(d.country_code);
  });

function getFlag(code) {
  return code
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt()));
}

/* ===== Rank ===== */
function getRank(cps) {
  if (cps < 3) return "🟤 Beginner";
  if (cps < 5) return "🔵 Average";
  if (cps < 8) return "🟢 Pro";
  return "🟣 Master";
}

/* ===== Time select ===== */
timeSelect.onchange = () => {
  customTime.style.display = timeSelect.value === "custom" ? "block" : "none";
};

/* ===== Start ===== */
startBtn.onclick = () => {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return alert("Nhập tên!");

  clicks = 0;
  started = true;
  lastClick = 0;

  duration = timeSelect.value === "custom"
    ? Number(customTime.value)
    : Number(timeSelect.value);

  if (!duration || duration <= 0) return alert("Thời gian không hợp lệ");

  clickArea.classList.remove("hidden");
  info.textContent = "Bắt đầu click!";
  rankInfo.textContent = "";
  clearTimeout(timer);

  timer = setTimeout(endGame, duration * 1000);
};

/* ===== Click ===== */
clickArea.onclick = () => {
  if (!started) return;

  const now = Date.now();
  if (now - lastClick < 20) return; // anti-cheat
  lastClick = now;

  clicks++;
};

/* ===== End ===== */
function endGame() {
  started = false;
  clickArea.classList.add("hidden");

  const cps = (clicks / duration).toFixed(2);
  const rank = getRank(cps);

  info.textContent = `CPS: ${cps}`;
  rankInfo.textContent = `Rank: ${rank}`;

  if (rank !== lastRank) {
    rankInfo.className = "rank-up";
    lastRank = rank;
  }

  submitScore(
    document.getElementById("playerName").value,
    Number(cps),
    rank
  );
}

/* ===== Submit BEST CPS only ===== */
async function submitScore(name, cps, rank) {
  const ref = db.collection("leaderboard");
  const snap = await ref.where("name", "==", name).limit(1).get();

  if (snap.empty) {
    await ref.add({ name, cps, rank, flag: countryFlag });
  } else {
    const doc = snap.docs[0];
    if (cps > doc.data().cps) {
      await ref.doc(doc.id).update({ cps, rank, flag: countryFlag });
    }
  }

  loadLeaderboard();
}

/* ===== Load leaderboard ===== */
function loadLeaderboard() {
  db.collection("leaderboard")
    .orderBy("cps", "desc")
    .limit(10)
    .get()
    .then(snap => {
      leaderboard.innerHTML = "";
      snap.forEach(d => {
        const p = d.data();
        leaderboard.innerHTML +=
          `<li>${p.flag} ${p.name} – ${p.cps} CPS (${p.rank})</li>`;
      });
    });
}

loadLeaderboard();









