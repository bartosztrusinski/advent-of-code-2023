const fs = require('fs');
const readline = require('readline');
const path = require('path');

const numbers = [];
const allDigitsPattern = /\d/g;
const spelledOutDigits = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../inputs/day_1.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (input) => {
    const number = getNumberFromInput(input);
    numbers.push(number);
  }).on('close', () => {
    console.log(numbers.reduce((sum, num) => sum + num, 0));
  });
};

const getNumberFromInput = (input) => {
  const noSpelledDigitsInput = replaceWordsWithDigits(input);
  const digitsOnly = noSpelledDigitsInput.match(allDigitsPattern);
  const firstDigit = digitsOnly[0];
  const lastDigit = digitsOnly.at(-1);

  return Number(`${firstDigit}${lastDigit}`);
};

const replaceWordsWithDigits = (inputString) => {
  return Object.entries(spelledOutDigits).reduce((input, [word, digit]) => {
    return input.replaceAll(word, `${word}${digit}${word}`);
  }, inputString);
};

run();
