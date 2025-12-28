body {
  font-family: Arial, sans-serif;
  background: #f4f6f8;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 350px;
  text-align: center;
}

input, select, button {
  width: 100%;
  padding: 8px;
  margin: 6px 0;
}

button {
  background: #27ae60;
  color: white;
  border: none;
  cursor: pointer;
}

#clickArea {
  display: none;
  margin: 20px 0;
  height: 180px;
  background: #3498db;
  color: white;
  font-size: 24px;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;

  display: flex;
  align-items: center;
  justify-content: center;
}

#clickArea:active {
  background: #1f6fb2;
}

ol {
  text-align: left;
  padding-left: 20px;
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

