const body = document.getElementById("body");
const btnArray = ["7", "8", "9", "/",
  "4", "5", "6", "X",
  "1", "2", "3", "-",
  "0", ".", "=", "+"]

const generateBody = () => {
  btnArray.forEach(num=>{
    const numBtn = document.createElement("div");
    numBtn.classList.add("button");
    if (/[\d.]/.test(num)) {
      numBtn.classList.add("number");
    }
    numBtn.textContent = num;
    body.appendChild(numBtn);
  })
}

generateBody();