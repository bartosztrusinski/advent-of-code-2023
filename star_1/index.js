const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  crlfDelay: Infinity,
});

const numbers = [];

rl.on('line', (line) => {
  const allDigits = [...line.matchAll(/\d/g)];
  const firstAndLastDigits = Number(allDigits[0] + allDigits.at(-1));

  numbers.push(firstAndLastDigits);
}).on('close', () => {
  console.log(numbers.reduce((acc, cur) => acc + cur, 0));
});
