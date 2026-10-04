import test from 'node:test';
import assert from 'node:assert';
import { calculate, CalculatorState } from './calc.js';

test('calculate basic arithmetic', () => {
  assert.strictEqual(calculate(2, '+', 3), 5);
  assert.strictEqual(calculate(5, '-', 2), 3);
  assert.strictEqual(calculate(4, '*', 3), 12);
  assert.strictEqual(calculate(10, '/', 2), 5);
});

test('calculate floating point precision', () => {
  assert.strictEqual(calculate(0.1, '+', 0.2), 0.3);
});

test('calculate division by zero', () => {
  assert.strictEqual(calculate(5, '/', 0), 'Error');
});

test('calculate invalid inputs', () => {
  assert.strictEqual(calculate('abc', '+', 3), 'Error');
});

test('CalculatorState digit input and clearing', () => {
  const calc = new CalculatorState();
  assert.strictEqual(calc.displayValue, '0');
  
  calc.inputDigit(5);
  assert.strictEqual(calc.displayValue, '5');
  
  calc.inputDigit(3);
  assert.strictEqual(calc.displayValue, '53');
  
  calc.clear();
  assert.strictEqual(calc.displayValue, '0');
  assert.strictEqual(calc.firstOperand, null);
});

test('CalculatorState decimal input', () => {
  const calc = new CalculatorState();
  calc.inputDecimal('.');
  assert.strictEqual(calc.displayValue, '0.');
  calc.inputDecimal('.');
  assert.strictEqual(calc.displayValue, '0.');
  calc.inputDigit(5);
  assert.strictEqual(calc.displayValue, '0.5');
});

test('CalculatorState arithmetic operations sequence', () => {
  const calc = new CalculatorState();
  calc.inputDigit(5);
  calc.handleOperator('+');
  calc.inputDigit(3);
  calc.calculateResult();
  assert.strictEqual(calc.displayValue, '8');
});

test('CalculatorState backspace', () => {
  const calc = new CalculatorState();
  calc.inputDigit(1);
  calc.inputDigit(2);
  calc.inputDigit(3);
  assert.strictEqual(calc.displayValue, '123');
  calc.backspace();
  assert.strictEqual(calc.displayValue, '12');
  calc.backspace();
  calc.backspace();
  assert.strictEqual(calc.displayValue, '0');
});

test('CalculatorState toggle sign and percentage', () => {
  const calc = new CalculatorState();
  calc.inputDigit(5);
  calc.toggleSign();
  assert.strictEqual(calc.displayValue, '-5');
  calc.toggleSign();
  assert.strictEqual(calc.displayValue, '5');

  calc.clear();
  calc.inputDigit(5);
  calc.input0 = calc.inputDigit(0); // 50
  calc.percentage();
  assert.strictEqual(calc.displayValue, '0.5');
});
