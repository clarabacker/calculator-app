const buttons = document.querySelectorAll(".button")
let currentOperation = document.querySelector(".current-operation")
let previousOperation = document.querySelector(".previous-operation")
let current = "0"
let previous = ""

// Function to format a number by adding commas for thousands separator and preserving decimal formatting
function formatNumberWithCommas(number) {
    // Convert the number to string and split it into integer and decimal parts
    let parts = number.toString().split(".")
    let integerPart = parts[0]
    let decimalPart

    // Check if the number has decimal part
    if (parts.length > 1) {
        decimalPart = "." + parts[1]
    } else {
        decimalPart = ""
    }

    // Insert commas as thousands separator in the integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return integerPart + decimalPart
}

// Loop through each button element to add a click event listener and determine the action to be taken based on its data attributes.
buttons.forEach(button => {
    button.addEventListener("click", function() {
      const value = this.getAttribute("data-number") || this.getAttribute("data-operator") || 
      this.getAttribute("data-equal") || this.getAttribute("data-delete") || this.getAttribute("data-reset")

      if (value === "." && current.includes(".")) { // Ensure that the decimal point is not added if it already exists in the current operation
        return 0
      }
      else if (value === "." && current === "0") { 
        current = "0."
        updateScreen()
      }
      else if (value === "DEL") {
          handleDelete()
      } else if (value === "RESET") {
          handleReset()
      } else if (value === "=") {
          calculate()
      } else if (this.getAttribute("data-number") !== null) {
          handleNumberClick(value)
      } else if (this.getAttribute("data-operator") !== null) {
          handleOperatorClick(value)
      }
    })
})

// Function to update the display screen with the current and previous operations
function updateScreen() {
    currentOperation.textContent = formatNumberWithCommas(current)
    previousOperation.textContent = previous
}

// Function to handle deletion of the last character in the current operation
function handleDelete() {
    if (current !== "ERROR") {
      current = current.slice(0, -1)
      if (current.trim() === "") {
        current = "0"
      }
      updateScreen()
    }
}

// Function to handle resetting the calculator
function handleReset() {
    current = "0"
    previous = ""
    updateScreen()
}

// Function to handle clicks on number buttons.
function handleNumberClick(number) {
    if (current === "0" || current === "ERROR") {
      current = number
    } else {
      current += number
    }
    updateScreen()
}

// Function to handle clicks on operator buttons
function handleOperatorClick(operator) {
  if (current !== "ERROR") {

      if (previous !== "") {
        if(current === "") {
          // Update the previous operation with the new operator if the current operation is empty
          const tokens = previous.split(" ")
          tokens[1] = operator
          previous = tokens.join(" ")
        }
        else {
          calculate() // Calculate the result of the previous operation
          previous = formatNumberWithCommas(current) + " " + operator
        }
      }
      else {
        previous = formatNumberWithCommas(current) + " " + operator
      }

      current = "" // Clear the current operation for entering the next number
      updateScreen()
  }
}

// Function to calculate the result of the previous operation
function calculate() {
    const tokens = previous.split(" ")

    // Check if the operation is valid (contains exactly two tokens: operand1 and operator)
    if (tokens.length !== 2) {
      current = "ERROR"
      previous = ""
      updateScreen()
      return
    }

    const operand1 = Big(tokens[0].replace(/,/g, "")) // Convert the first operand to a Big number, removing commas if present
    const operator = tokens[1]
    const operand2 = Big(currentOperation.textContent.replace(/,/g, "")) // Extract the second operand from the current operation, converting it to a Big number and removing commas if present

    if (isNaN(operand1) || isNaN(operand2)) {
      current = "ERROR"
      previous = ""
      updateScreen()
      return
    }

    switch (operator) {
      case "+":
        current = operand1.plus(operand2).toString()
        break
      case "-":
        current = operand1.minus(operand2).toString()
        break
      case "*":
        current = operand1.times(operand2).toString()
        break
      case "/":
        // Check for division by zero
        if (operand2.eq(0)) {
          current = "ERROR"
          previous = ""
          updateScreen()
          return
        }
        current = operand1.div(operand2).toString()
        break
      default:
        current = "ERROR"
        previous = ""
        updateScreen()
        return
    }

    previous = ""
    updateScreen()
}