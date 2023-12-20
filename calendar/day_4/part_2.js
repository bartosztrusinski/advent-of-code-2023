const fs = require('fs');
const readline = require('readline');
const path = require('path');

const cardCopies = Array.from({ length: 199 }, () => 1);
cardCopies[0] = 0;
let index = 1;

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_4.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (inputLine) => {
    const [winningNumbers, playedNumbers] = getCardNumbers(inputLine);
    const cardHitCount = getCardHitCount(winningNumbers, playedNumbers);

    addCardCopies(cardHitCount);

    index++;
  }).on('close', () => {
    console.log(cardCopies.reduce((acc, curr) => acc + curr, 0));
  });
};

const getCardNumbers = (inputLine) => {
  const startIndex = inputLine.indexOf(':') + 1;
  const splitIndex = inputLine.indexOf('|');
  const winningNumbers = inputLine
    .substring(startIndex, splitIndex)
    .split(' ')
    .filter(Number)
    .map(Number);
  const playedNumbers = inputLine
    .substring(splitIndex + 1)
    .split(' ')
    .filter(Number)
    .map(Number);

  return [winningNumbers, playedNumbers];
};

const getCardHitCount = (winningNumbers, playedNumbers) => {
  return playedNumbers.reduce(
    (hitCount, playedNumber) =>
      winningNumbers.includes(playedNumber) ? hitCount + 1 : hitCount,
    0
  );
};

const addCardCopies = (cardHitCount) => {
  for (let i = index + 1; i <= index + cardHitCount; i++) {
    cardCopies[i] = cardCopies[i] + cardCopies[index];
  }
};

run();
