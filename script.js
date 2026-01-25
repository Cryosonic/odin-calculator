const historyDisplay = document.getElementById("history");
const inputDisplay = document.getElementById("input");
const clearBtn = document.getElementById("clear");
const offBtn = document.getElementById("off");
const deleteBtn = document.getElementById("del");
const negativeBtn = document.getElementById("neg");
const body = document.getElementById("body");
const btnArray = ["7", "8", "9", "/",
  "4", "5", "6", "X",
  "1", "2", "3", "-",
  "0", ".", "=", "+"]

const history = {
  userInputRecord: [],
  lastResult: 0,
  currentResult: 0,

  clearDisplay: () => {
    userInputRecord = [];
    lastResult = 0;
    currentResult = 0;
    historyDisplay.textContent = "";
    inputDisplay.textContent = 0;
  }
}

const display = {
  update: (num) => {
    inputDisplay.textContent += num;
  }
}

const generateBody = () => {
  btnArray.forEach(num=>{
    const numBtn = document.createElement("div");
    numBtn.id = num;
    numBtn.classList.add("button");
    if (/[\d.]/.test(num)) {
      numBtn.classList.add("number");
    }
    numBtn.textContent = num;
    body.appendChild(numBtn);
  })
}

generateBody();

clearBtn.addEventListener("click", ()=>{
  history.clearDisplay();
})

const checkButtonPressed = (e) => {
  const buttonPressed = e.target.id;
  if (!isNaN(buttonPressed) || buttonPressed === ".") {
    display.update(buttonPressed)
  } else {
    switch (buttonPressed) {
      case "/":
        display.divide();
      break;
      case "X":
        display.multiply();
      break;
      case "-":
        display.subtract();
      break;
      case "+":
        display.add();
      break;
      case "=":
        display.calculate();
      break;
    }
  }
}

body.addEventListener("click", checkButtonPressed);

//NOTE: Input display can hold 10 characters, history can hold 18 characters