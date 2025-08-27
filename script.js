const display = document.querySelector(".display");
const buttons = document.querySelector(".buttons-container");
const clearButton = document.querySelector(".clear-button");

let currentValue, firstNumber, operator, secondNumber;

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  return x / y;
}

function operate(firstNumber, operator, secondNumber) {
  firstNumber = Number(firstNumber);
  secondNumber = Number(secondNumber);

  switch (operator) {
    case "+":
      return add(firstNumber, secondNumber);
    case "-":
      return subtract(firstNumber, secondNumber);
    case "×":
      return multiply(firstNumber, secondNumber);
    case "÷":
      return divide(firstNumber, secondNumber);
  }
}

function roundTo(number, dp) {
  const factor = 10 ** dp;
  return Math.round((number + Number.EPSILON) * factor) / factor;
}

function resetStateValues() {
  currentValue = "";
  firstNumber = null;
  operator = null;
  secondNumber = null;
}

function enableClearButton() {
  clearButton.addEventListener("click", () => {
    display.textContent = "";
    resetStateValues();
  });
}

function enableCalculator() {
  display.textContent = "";
  resetStateValues();

  buttons.addEventListener("click", (event) => {
    if (!event.target.classList.contains("button")) {
      return;
    }

    const value = event.target.textContent;
    const valueIsNumber = !isNaN(value);
    const valueIsOperator = ["+", "-", "×", "÷"].includes(value);
    const valueIsEqual = value === "=";

    if (valueIsNumber) {
      currentValue += value;
      display.textContent = currentValue;
    } else if (valueIsOperator) {
      if (firstNumber !== null && currentValue.length !== 0) {
        // if firstNumber has a value AND currentValue has a value (this means it is chaining operation)
        secondNumber = currentValue;
        firstNumber = roundTo(operate(firstNumber, operator, secondNumber), 4);
        display.textContent = firstNumber;
        currentValue = "";

        if (firstNumber === Infinity) {
          display.textContent = "Nice try :D";
          resetStateValues();
          return;
        }
      } else if (firstNumber === null) {
        // else if firstNumber does NOT have a value (this means end of input for firstNumber and listen to further operator OR secondNumber)
        firstNumber = currentValue;
        currentValue = "";
      }
      operator = value;
    } else if (valueIsEqual) {
      if (firstNumber !== null && currentValue.length !== 0) {
        // if firstNumber has a value AND currentValue has a value (this means it is ready for operation)
        secondNumber = currentValue;
        const result = roundTo(operate(firstNumber, operator, secondNumber), 4);
        display.textContent = result;

        if (result === Infinity) {
          display.textContent = "Nice try :D";
          resetStateValues();
          return;
        }

        // prepare for next round of input
        resetStateValues();
        firstNumber = result;
      }
    }
  });
}

function init() {
  enableClearButton();
  enableCalculator();
}

init();
