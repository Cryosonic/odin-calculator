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
  hasPower: false,
  hasCalculated: true,

  clearDisplay() {
    this.userInputRecord = [];
    this.lastResult = 0;
    this.hasPower = true;
    this.hasCalculated = true;
    historyDisplay.textContent = "";
    inputDisplay.value = 0;
    if(inputDisplay.hasAttribute("disabled")) {
      inputDisplay.removeAttribute("disabled");
    };
  },

  powerOff() {
    this.hasPower = false;
    historyDisplay.textContent = "";
    inputDisplay.value = "";
    inputDisplay.setAttribute("disabled", "true");
  },

  updateInputDisplay(output) {
    // NOTE: Input display can hold 10 characters
    const currentlyDisplayed = inputDisplay.value;

    if(this.hasPower) {
      if (this.hasCalculated) {
        this.hasCalculated = false;

        if (output === ".") {
          inputDisplay.value = "0.";
        } else {
          inputDisplay.value = output;
        }
      } else if (currentlyDisplayed.length < 9) {
        const numbers = /[\d]/;

        if (numbers.test(output)) {
          inputDisplay.value += output;
        } else if (output === "." && !inputDisplay.value.includes(".")) {
          inputDisplay.value += output;
        }
      }
    }
  },

  updateHistoryDisplay() {
    // NOTE: history can hold 21 characters

    let startIndexOfShortList = -10;
    let shortenedHistoryList = this.userInputRecord;
    
    while (shortenedHistoryList.join("").length > 18) {
      shortenedHistoryList = shortenedHistoryList.slice(startIndexOfShortList);
      startIndexOfShortList++;
    }
    
    historyDisplay.textContent = shortenedHistoryList.join("");
  },

  resolve(firstNumber, operator, secondNumber) {
    switch(operator) {
      case "+":
        this.lastResult = ((firstNumber*10000000) + (secondNumber*10000000))/10000000;
      break;
      case "-":
        this.lastResult = ((firstNumber*10000000) - (secondNumber*10000000))/10000000;
      break;
      case "X":
        this.lastResult = firstNumber * secondNumber;
      break;
      case "/":
        if (secondNumber === 0) {
          this.lastResult = 0;
        } else {
          this.lastResult = firstNumber / secondNumber;
        }
      break;
    }
  },

  calculate(operator) {
    if(this.hasPower && !this.hasCalculated) {
      const operators = ["+", "-", "/", "X", "*"];
      const currentlyDisplayed = Number(inputDisplay.value);

      if (this.userInputRecord.length < 1) {
        if (operators.includes(operator)) {
          this.userInputRecord.push(currentlyDisplayed);
          this.updateHistoryDisplay();
          this.userInputRecord.push(operator)
          this.lastResult = currentlyDisplayed;
          this.hasCalculated = true;
        }
      } else if (this.userInputRecord.length > 1) {
        if (operators.includes(operator) || operator === "=") {
          this.userInputRecord.push(currentlyDisplayed);
          this.updateHistoryDisplay();
          const previousOperator = this.userInputRecord[this.userInputRecord.length-2];
          this.resolve(this.lastResult, previousOperator, currentlyDisplayed);

          if (operators.includes(operator)) {
            this.userInputRecord.push(operator);
          }
          
          // NOTE: Input display can hold 10 characters
          inputDisplay.value = Number(this.lastResult.toString().substring(0,10));

          if (operator === "=") {
            this.userInputRecord = [];
            this.lastResult = 0;
          }

          this.hasCalculated = true;
        }
      }
    }
  },
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

const checkButtonPressed = (e) => {
  const operators = ["+", "-", "/", "X", "=", "*", "Enter"];
  let buttonPressed = "";
  if (e.type === "keypress") {
    if (isNaN(e.key) && e.key !== ".") {
      buttonPressed = e.key;
    }
  } else if (e.type === "click") {
    buttonPressed = e.target.id;
  }

  if (!isNaN(buttonPressed) || buttonPressed === ".") {
    history.updateInputDisplay(buttonPressed);
  } else if (operators.includes(buttonPressed)) {
    if (buttonPressed === "Enter") {
      history.calculate("=");
    } else if (buttonPressed === "*") {
      history.calculate("X")
    } else {
      history.calculate(buttonPressed);
    }
  }
}

generateBody();
clearBtn.addEventListener("click", ()=>{history.clearDisplay()});
offBtn.addEventListener("click", history.powerOff);
deleteBtn.addEventListener("click", () => {
  const inputArray = inputDisplay.value.split("")
  if(inputArray.length === 1) {
    inputDisplay.value = "0";
    history.hasCalculated = true;
  } else {
    inputArray.pop();
    inputDisplay.value = inputArray.join("");
  }
})
negativeBtn.addEventListener("click", ()=>{
  inputDisplay.textContent = (Number(inputDisplay.textContent) * -1);
})
body.addEventListener("click", checkButtonPressed);
inputDisplay.addEventListener("keypress", checkButtonPressed);