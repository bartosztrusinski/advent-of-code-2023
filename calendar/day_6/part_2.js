const fs = require('fs');
const readline = require('readline');
const path = require('path');

const dataTuple = [];

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_6.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (inputLine) => {
    dataTuple.push(getDataFromInput(inputLine));
  }).on('close', () => {
    const [time, distanceToBeat] = dataTuple;
    const result = computeResult(time, distanceToBeat);

    console.log(result);
  });
};

const computeResult = (time, distanceToBeat) => {
  const possibleDistances = calculatePossibleDistances(time);
  const winningDistances = getWinningDistances(
    possibleDistances,
    distanceToBeat
  );

  return winningDistances.length;
};

const getDataFromInput = (inputLine) => {
  const dataStartIndex = inputLine.indexOf(':') + 1;
  return Number(
    inputLine.slice(dataStartIndex).split(' ').filter(Boolean).join('')
  );
};

const calculatePossibleDistances = (time) => {
  const possibleDistances = [];

  for (let timeCharging = 1; timeCharging < time; timeCharging++) {
    possibleDistances.push((time - timeCharging) * timeCharging);
  }

  return possibleDistances;
};

const getWinningDistances = (possibleDistances, distanceToBeat) => {
  return possibleDistances.filter((distance) => distance > distanceToBeat);
};

run();
