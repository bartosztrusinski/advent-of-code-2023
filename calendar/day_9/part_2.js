const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_9.txt')),
  crlfDelay: Infinity,
});

let extrapolatedValuesSum = 0;

const run = () => {
  rl.on('line', (inputLine) => {
    const history = getHistory(inputLine);
    const sequences = generateSequences([history]);
    const extrapolatedValue = extrapolateNextValue(sequences);
    extrapolatedValuesSum += extrapolatedValue;
  }).on('close', () => {
    console.log(extrapolatedValuesSum);
  });
};

const getHistory = (inputLine) => {
  return inputLine.split(' ').map((num) => Number(num));
};

const generateSequences = (sequences) => {
  const lastSequence = sequences.at(-1);

  if (isSequenceOfZeros(lastSequence)) {
    return sequences;
  }

  const nextSequence = lastSequence.reduce((newSequence, _, index) => {
    return lastSequence[index + 1] === undefined
      ? newSequence
      : [...newSequence, lastSequence[index + 1] - lastSequence[index]];
  }, []);

  return generateSequences([...sequences, nextSequence]);
};

const extrapolateNextValue = (sequences, index = 0) => {
  if (isSequenceOfZeros(sequences[index])) {
    return 0;
  }

  return sequences[index][0] - extrapolateNextValue(sequences, index + 1);
};

const isSequenceOfZeros = (sequence) => sequence.every((num) => num === 0);

run();
