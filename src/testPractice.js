// greeting.js
export function sum(a, b) {
  return a + b;
}

export function capitalize(str) {
  if(!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function reverseString(str) {
  return str.split('').reverse().join('');
}

export class Calculator {
  add(num1, num2) {
    return num1 + num2;
  }
  subtract(num1, num2) {
    return num1 - num2;
  }
  multiply(num1, num2) {
    return num1 * num2;
  }
  divide(num1, num2) {
    return num1 / num2;
  }
}

export function caesarCipher(text, shift) {
  let result = '';

  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.match(/[a-z]/i)) {
      const code = text.charCodeAt(i);
      let shiftedCode;

      if (code >= 65 && code <= 90) { // Uppercase letters
        shiftedCode = ((code - 65 + shift) % 26) + 65;
      } else if (code >= 97 && code <= 122) { // Lowercase letters
        shiftedCode = ((code - 97 + shift) % 26) + 97;
      }
      result += String.fromCharCode(shiftedCode);
    } else {
      result += char;
    }
  }
  return result;
}

export function analyzeArray(arr) {
  let arrObject = {
    average: null,
    min: null,
    max: null,
    length: null
  };
  if(!arr) return arrObject;
  let sum = 0;
  arrObject.max, arrObject.min = arr[0];
  for(let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if(arr[i] > arrObject.max) arrObject.max = arr[i];
    if(arr[i] < arrObject.min) arrObject.min = arr[i];
    arrObject.length++;
  }
  arrObject.average = sum / arrObject.length;
  return arrObject;
}