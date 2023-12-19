const fs = require('fs');
const readline = require('readline');
const path = require('path');

const numbers = [];
const allDigitsPattern = /\d/g;

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../inputs/day_1.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (line) => {
    const allDigits = line.match(allDigitsPattern);
    const firstDigit = allDigits[0];
    const lastDigit = allDigits.at(-1);

    numbers.push(Number(`${firstDigit}${lastDigit}`));
  }).on('close', () => {
    console.log(numbers.reduce((acc, cur) => acc + cur, 0));
  });
};

run();
