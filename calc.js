export function calculate(a, operator, b) {
  const num1 = parseFloat(a);
  const num2 = parseFloat(b);
  if (isNaN(num1) || isNaN(num2)) return 'Error';
  
  let result;
  switch (operator) {
    case '+':
      result = num1 + num2;
      break;
    case '-':
      result = num1 - num2;
      break;
    case '*':
      result = num1 * num2;
      break;
    case '/':
      if (num2 === 0) return 'Error';
      result = num1 / num2;
      break;
    default:
      return 'Error';
  }
  
  // Handle floating point precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
  return parseFloat(result.toFixed(10));
}

export class CalculatorState {
  constructor() {
    this.displayValue = '0';
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
    this.operator = null;
  }

  inputDigit(digit) {
    if (this.waitingForSecondOperand) {
      this.displayValue = String(digit);
      this.waitingForSecondOperand = false;
    } else {
      this.displayValue = this.displayValue === '0' ? String(digit) : this.displayValue + digit;
    }
  }

  inputDecimal(dot) {
    if (this.waitingForSecondOperand) {
      this.displayValue = '0.';
      this.waitingForSecondOperand = false;
      return;
    }
    if (!this.displayValue.includes(dot)) {
      this.displayValue += dot;
    }
  }

  handleOperator(nextOperator) {
    const inputValue = parseFloat(this.displayValue);

    if (this.operator && this.waitingForSecondOperand) {
      this.operator = nextOperator;
      return;
    }

    if (this.firstOperand === null && !isNaN(inputValue)) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = calculate(this.firstOperand, this.operator, inputValue);
      if (result === 'Error') {
        this.displayValue = 'Error';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = true;
        return;
      }
      this.displayValue = String(result);
      this.firstOperand = result;
    }

    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
  }

  calculateResult() {
    const inputValue = parseFloat(this.displayValue);

    if (this.operator && this.firstOperand !== null) {
      if (this.waitingForSecondOperand) {
        // If waiting for second operand, use firstOperand as secondOperand or do nothing
        return;
      }
      const result = calculate(this.firstOperand, this.operator, inputValue);
      if (result === 'Error') {
        this.displayValue = 'Error';
      } else {
        this.displayValue = String(result);
      }
      this.firstOperand = null;
      this.operator = null;
      this.waitingForSecondOperand = false;
    }
  }

  clear() {
    this.displayValue = '0';
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
    this.operator = null;
  }

  backspace() {
    if (this.waitingForSecondOperand) return;
    if (this.displayValue.length === 1 || (this.displayValue.length === 2 && this.displayValue.startsWith('-'))) {
      this.displayValue = '0';
    } else {
      this.displayValue = this.displayValue.slice(0, -1);
    }
  }

  toggleSign() {
    if (this.displayValue === '0' || this.displayValue === 'Error') return;
    if (this.displayValue.startsWith('-')) {
      this.displayValue = this.displayValue.slice(1);
    } else {
      this.displayValue = '-' + this.displayValue;
    }
  }

  percentage() {
    const val = parseFloat(this.displayValue);
    if (isNaN(val)) return;
    this.displayValue = String(parseFloat((val / 100).toFixed(10)));
  }
}
