import { experiments } from "webpack";
import { sum, capitalize, reverseString, Calculator, caesarCipher, analyzeArray } from "./testPractice.js";
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('capitalize', () => {
  expect(capitalize("brown")).toBe("Brown");
});

test('reverses string', () => {
  expect(reverseString('mop')).toBe('pom');
});

describe('calculator operations', () => {
  test('add', () => {
    const calculator = new Calculator;
    expect(calculator.add(5, 6)).toBe(11);
  });
  test('subtract', () => {
    const calculator = new Calculator;
    expect(calculator.subtract(4, 2)).toBe(2);
  });
  test('divide', () => {
    const calculator = new Calculator;
    expect(calculator.divide(6, 2)).toBe(3);
  })
  test('multiply', () => {
    const calculator = new Calculator;
    expect(calculator.multiply(3, 2)).toBe(6);
  })
});

test('caesar cipher', () => {
  expect(caesarCipher('xyz!', 3)).toBe('abc!');
});

test('analyze array', () => {
  expect(analyzeArray([1, 8, 3, 4, 2, 6])).toEqual({average: 4, min: 1, max: 8, length: 6});
});