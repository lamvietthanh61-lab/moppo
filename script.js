let clicks = 0;
let timeLeft = 0;
let timer = null;
let started = false;

let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
renderBoard();

function startTest() {
  let name = document.getElementById("playerName").value.trim();
  if (!name) {
    alert("Vui lòng nhập tên!");
    return;
  }

  clicks = 0;
  started = true;
 timeLeft = getSelectedTime();
if (timeLeft === null) return;

  document.getElementById("clicks").innerText = 0;
  document.getElementById("time").innerText = timeLeft;
  document.getElementById("clickArea").style.display = "flex";
  document.getElementById("startBtn").disabled = true;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

function registerClick() {
  if (!started) return;
  clicks++;
  document.getElementById("clicks").innerText = clicks;
}

function endTest() {
  clearInterval(timer);
  started = false;

  let duration = getSelectedTime();
  let cps = (clicks / duration).toFixed(2);

  let name = document.getElementById("playerName").value.trim();

  leaderboard.push({ name, cps });
  leaderboard.sort((a, b) => b.cps - a.cps);
  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderBoard();

  let rank = leaderboard.findIndex(p => p.name === name && p.cps === cps) + 1;

  alert(
    `⏱ HẾT GIỜ!\n` +
    `⚡ CPS: ${cps}\n` +
    `🏆 Xếp hạng: #${rank}`
  );

  document.getElementById("clickArea").style.display = "none";
  document.getElementById("startBtn").disabled = false;
}

function renderBoard() {
  let list = document.getElementById("leaderboard");
  list.innerHTML = "";

  leaderboard.forEach((p, i) => {
    let li = document.createElement("li");
    li.innerText = `#${i + 1} ${p.name} - ${p.cps} CPS`;
    list.appendChild(li);
  });
}
function toggleCustomTime() {
  const select = document.getElementById("timeSelect");
  const customInput = document.getElementById("customTime");

  customInput.style.display =
    select.value === "custom" ? "block" : "none";
}

function getSelectedTime() {
  const select = document.getElementById("timeSelect");

  if (select.value === "custom") {
    const custom = parseInt(
      document.getElementById("customTime").value
    );

    if (!custom || custom < 1) {
      alert("Thời gian tuỳ chỉnh phải >= 1 giây");
      return null;
    }
    return custom;
  }

  return parseInt(select.value);
}



