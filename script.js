/******** FIREBASE CONFIG – THAY BẰNG CỦA BẠN ********/
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
/****************************************************/

let clickCount = 0;
let startTime = 0;
let duration = 0;
let timer;
let clickTimes = [];

const clickArea = document.getElementById("clickArea");
const result = document.getElementById("result");
const sound = document.getElementById("clickSound");

/* Dark mode */
function toggleMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
}
if (localStorage.getItem("dark") === "true") {
  document.body.classList.add("dark");
}

/* Time select */
document.getElementById("timeSelect").onchange = e => {
  document.getElementById("customTime").style.display =
    e.target.value === "custom" ? "block" : "none";
};

/* Start */
function startTest() {
  clickCount = 0;
  clickTimes = [];
  startTime = Date.now();

  const sel = document.getElementById("timeSelect").value;
  duration = sel === "custom"
    ? Number(document.getElementById("customTime").value)
    : Number(sel);

  clearTimeout(timer);
  timer = setTimeout(endTest, duration * 1000);
}

/* Click */
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

  playSound();
};

/* End */
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
  applyRankTheme(rank);
  saveProfile(cps, rank);
  uploadScore(cps);
}

/* Rank */
function getRank(cps) {
  if (cps < 5) return "Bronze";
  if (cps < 7) return "Silver";
  if (cps < 9) return "Gold";
  return "Diamond";
}
function applyRankTheme(rank) {
  document.body.classList.remove("bronze","silver","gold","diamond");
  document.body.classList.add(rank.toLowerCase());
}
function showRank(rank) {
  const d = document.createElement("div");
  d.className = "rank-popup";
  d.innerText = "🏆 " + rank;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),2000);
}

/* Sound */
function playSound() {
  sound.currentTime = 0;
  sound.play();
}

/* Profile */
function saveProfile(cps, rank) {
  const name = document.getElementById("playerName").value || "Anonymous";
  document.getElementById("profile").innerHTML =
    `👑 ${name}<br>CPS: ${cps.toFixed(2)}<br>Rank: ${rank}`;
}

/* Firebase upload */
function uploadScore(cps) {
  const name = document.getElementById("playerName").value || "Anonymous";
  db.collection("scores").add({
    name,
    cps,
    time: Date.now()
  });
}

/* Anti-cheat */
function detectCheat() {
  if (clickTimes.length < 15) return false;
  let intervals = [];
  for (let i=1;i<clickTimes.length;i++)
    intervals.push(clickTimes[i]-clickTimes[i-1]);
  let avg = intervals.reduce((a,b)=>a+b)/intervals.length;
  let variance = intervals.reduce((a,b)=>a+(b-avg)**2,0)/intervals.length;
  return variance < 5;
}





