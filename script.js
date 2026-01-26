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
    inputDisplay.textContent = 0;
  },

  powerOff() {
    this.hasPower = false;
    historyDisplay.textContent = "";
    inputDisplay.textContent = "";
  },

  updateInputDisplay(output) {
    //NOTE: Input display can hold 10 characters, history can hold 18 characters
    const currentlyDisplayed = inputDisplay.textContent;

    if(this.hasPower) {
      // TODO: allow reset when 9 numbers are displayed.
      if (currentlyDisplayed.length < 9) {
        if (this.hasCalculated) {
          this.hasCalculated = false;

          if (output === ".") {
            inputDisplay.textContent += "0.";
          } else {
            inputDisplay.textContent = output;
          }
        } else if (output === "." && !currentlyDisplayed.includes(".")) {
          inputDisplay.textContent += output;
        } else {
          inputDisplay.textContent += output;
        }
      }
    }
  },

  updateHistoryDisplay() {
    historyDisplay.textContent = this.userInputRecord.join("");
  },

  resolve(firstNumber, operator, secondNumber) {
    switch(operator) {
      case "+":
        this.lastResult = ((firstNumber*10000000) + (secondNumber*10000000))/10000000;
      break;
      case "-":
        this.lastResult = firstNumber - secondNumber;
      break;
      case "X":
        this.lastResult = firstNumber * secondNumber;
      break;
      case "/":
        this.lastResult = firstNumber / secondNumber;
      break;
    }
  },

  calculate(operator) {
    // TODO: enter sign is not input after first number entry

    if(this.hasPower || !this.hasCalculated) {
      const currentlyDisplayed = Number(inputDisplay.textContent);
      this.userInputRecord.push(currentlyDisplayed);
      this.hasCalculated = true;

      if (this.userInputRecord.length < 3) {
        this.lastResult = currentlyDisplayed;
        this.userInputRecord.push(operator);
        this.updateHistoryDisplay();
      } else if (this.userInputRecord.length >= 3) {
        const operators = ["+", "-", "/", "X"];
        const previousOperator = this.userInputRecord[this.userInputRecord.length-2];
        
        this.resolve(this.lastResult, previousOperator, currentlyDisplayed);
        
        inputDisplay.textContent = this.lastResult;
        
        if (operators.includes(operator)) {
          this.userInputRecord.push(operator);
        }

        this.updateHistoryDisplay();

        if (operator === "=") {
          this.userInputRecord = [];
          this.lastResult = 0;
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
  const operators = ["+", "-", "/", "X", "="];
  const buttonPressed = e.target.id;

  if (!isNaN(buttonPressed) || buttonPressed === ".") {
    history.updateInputDisplay(buttonPressed);
  } else if (operators.includes(buttonPressed)){
    history.calculate(buttonPressed);
  }
}

generateBody();
clearBtn.addEventListener("click", ()=>{history.clearDisplay()});
offBtn.addEventListener("click", history.powerOff);
deleteBtn.addEventListener("click", () => {
  const inputArray = inputDisplay.textContent.split("")
  if(inputArray.length === 1) {
    inputDisplay.textContent = "0";
    history.hasCalculated = true;
  } else {
    inputArray.pop();
    inputDisplay.textContent = inputArray.join("");
  }
})
body.addEventListener("click", checkButtonPressed);