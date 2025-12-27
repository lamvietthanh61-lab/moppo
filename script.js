let clicks = 0;
let timeLeft = 0;
let timer = null;
let started = false;

let bestCps = localStorage.getItem("bestCps") || 0;
document.getElementById("bestCps").innerText = bestCps;

let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
renderBoard();

function registerClick() {
  if (!started) startTest();
  if (timeLeft > 0) {
    clicks++;
    document.getElementById("clicks").innerText = clicks;
    document.getElementById("clickSound").play();
  }
}

function startTest() {
  let name = document.getElementById("player").value.trim();
  if (!name) {
    alert("Nhập tên người chơi!");
    return;
  }

  started = true;
  clicks = 0;
  timeLeft = parseInt(timeSelect.value);

  document.getElementById("clicks").innerText = 0;
  document.getElementById("time").innerText = timeLeft;
  document.getElementById("cps").innerText = 0;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      let cps = (clicks / timeSelect.value).toFixed(2);
      document.getElementById("cps").innerText = cps;
      saveScore(name, cps);
      started = false;
    }
  }, 1000);
}

function saveScore(name, cps) {
  if (cps > bestCps) {
    bestCps = cps;
    localStorage.setItem("bestCps", bestCps);
    document.getElementById("bestCps").innerText = bestCps;
  }

  leaderboard.push({ name, cps });
  leaderboard.sort((a,b)=>b.cps-a.cps);
  leaderboard = leaderboard.slice(0,5);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderBoard();
}

function renderBoard() {
  let list = document.getElementById("leaderboard");
  list.innerHTML = "";
  leaderboard.forEach(p=>{
    let li = document.createElement("li");
    li.innerText = `${p.name} - ${p.cps} CPS`;
    list.appendChild(li);
  });
}

function resetTest() {
  clearInterval(timer);
  clicks = 0;
  timeLeft = 0;
  started = false;
  document.getElementById("clicks").innerText = 0;
  document.getElementById("time").innerText = 0;
  document.getElementById("cps").innerText = 0;
}

function toggleMode() {
  document.body.classList.toggle("dark");
}
