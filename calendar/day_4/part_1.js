const fs = require('fs');
const readline = require('readline');
const path = require('path');

const cardPointSums = [];

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_4.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (inputLine) => {
    const [winningNumbers, playedNumbers] = getCardNumbers(inputLine);
    const cardHitCount = getCardHitCount(winningNumbers, playedNumbers);
    const cardPoints = computeCardPoints(cardHitCount);
    cardPointSums.push(cardPoints);
  }).on('close', () => {
    console.log(cardPointSums.reduce((sum, cardPoints) => sum + cardPoints, 0));
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

const computeCardPoints = (cardHitCount) => {
  return cardHitCount === 0 ? 0 : 2 ** (cardHitCount - 1);
};

run();
