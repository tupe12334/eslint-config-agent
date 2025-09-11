// Valid: Short file under 70 lines (no warnings or errors)
// This file demonstrates proper file length management

export class NumberUtils {
  static calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
  }

  static calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return this.calculateSum(numbers) / numbers.length;
  }

  static findMaxValue(numbers) {
    if (numbers.length === 0) return null;
    return Math.max(...numbers);
  }

  static findMinValue(numbers) {
    if (numbers.length === 0) return null;
    return Math.min(...numbers);
  }

  static sortNumbers(numbers) {
    return [...numbers].sort((a, b) => a - b);
  }

  static filterEvenNumbers(numbers) {
    return numbers.filter((num) => num % 2 === 0);
  }

  static filterOddNumbers(numbers) {
    return numbers.filter((num) => num % 2 !== 0);
  }

  static multiplyByTwo(numbers) {
    return numbers.map((num) => num * 2);
  }

  static containsNumber(numbers, target) {
    return numbers.includes(target);
  }

  static removeNumber(numbers, target) {
    return numbers.filter((num) => num !== target);
  }

  static addNumber(numbers, newNumber) {
    return [...numbers, newNumber];
  }

  static getUniqueNumbers(numbers) {
    return [...new Set(numbers)];
  }

  static reverseNumbers(numbers) {
    return [...numbers].reverse();
  }

  static getNumbersInRange(numbers, min, max) {
    return numbers.filter((num) => num >= min && num <= max);
  }
}

// This file has less than 70 lines and should not trigger any max-lines warnings or errors
export default NumberUtils;
