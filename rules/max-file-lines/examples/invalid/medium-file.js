// Invalid: File with 70-100 lines (should trigger max-lines warning)
// This file demonstrates what happens when a file grows beyond the recommended size

class ExtendedNumberUtils {
  constructor() {
    this.cache = new Map();
  }

  calculateSum(numbers) {
    const key = numbers.join(',');
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    this.cache.set(key, sum);
    return sum;
  }

  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return this.calculateSum(numbers) / numbers.length;
  }

  findMaxValue(numbers) {
    if (numbers.length === 0) return null;
    return Math.max(...numbers);
  }

  findMinValue(numbers) {
    if (numbers.length === 0) return null;
    return Math.min(...numbers);
  }

  sortNumbers(numbers) {
    return [...numbers].sort((a, b) => a - b);
  }

  filterEvenNumbers(numbers) {
    return numbers.filter(num => num % 2 === 0);
  }

  filterOddNumbers(numbers) {
    return numbers.filter(num => num % 2 !== 0);
  }

  multiplyByTwo(numbers) {
    return numbers.map(num => num * 2);
  }

  containsNumber(numbers, target) {
    return numbers.includes(target);
  }

  removeNumber(numbers, target) {
    return numbers.filter(num => num !== target);
  }

  addNumber(numbers, newNumber) {
    return [...numbers, newNumber];
  }

  getNumberAtIndex(numbers, index) {
    if (index < 0 || index >= numbers.length) {
      return undefined;
    }
    return numbers[index];
  }

  getLastNumber(numbers) {
    return numbers.length > 0 ? numbers[numbers.length - 1] : undefined;
  }

  getFirstNumber(numbers) {
    return numbers.length > 0 ? numbers[0] : undefined;
  }

  reverseNumbers(numbers) {
    return [...numbers].reverse();
  }

  shuffleNumbers(numbers) {
    const shuffled = [...numbers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }

  getUniqueNumbers(numbers) {
    return [...new Set(numbers)];
  }

  getDuplicateNumbers(numbers) {
    const seen = new Set();
    const duplicates = new Set();
    for (const num of numbers) {
      if (seen.has(num)) {
        duplicates.add(num);
      } else {
        seen.add(num);
      }
    }
    return [...duplicates];
  }

  countOccurrences(numbers, target) {
    return numbers.filter(num => num === target).length;
  }

  getNumbersInRange(numbers, min, max) {
    return numbers.filter(num => num >= min && num <= max);
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}

// This file has between 70-100 lines and should trigger a max-lines warning
export default ExtendedNumberUtils;