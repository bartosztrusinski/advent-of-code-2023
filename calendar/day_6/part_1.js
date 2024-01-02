const fs = require('fs');
const readline = require('readline');
const path = require('path');

const data = [];

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_6.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (inputLine) => {
    data.push(getDataFromInput(inputLine));
  }).on('close', () => {
    const dataTuples = transformDataIntoTuples(data);
    const result = computeResult(dataTuples);

    console.log(result);
  });
};

const computeResult = (dataTuples) => {
  return dataTuples.reduce((result, dataTuple) => {
    const [time, distanceToBeat] = dataTuple;
    const possibleDistances = calculatePossibleDistances(time);
    const winningDistances = getWinningDistances(
      possibleDistances,
      distanceToBeat
    );
    const distanceBeatCount = winningDistances.length;

    return result === 0 ? distanceBeatCount : result * distanceBeatCount;
  }, 0);
};

const getDataFromInput = (inputLine) => {
  const dataStartIndex = inputLine.indexOf(':') + 1;
  return inputLine.slice(dataStartIndex).split(' ').filter(Boolean).map(Number);
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

const transformDataIntoTuples = (data) => {
  const [times, distancesToBeat] = data;
  return times.map((time, index) => [time, distancesToBeat[index]]);
};

run();
