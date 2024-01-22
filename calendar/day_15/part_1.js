const run = require('../../run');

const day = 15;
const initializationSequence = [];

const onLineRead = (inputLine) => {
  initializationSequence.push(...inputLine.split(','));
};

const onClose = () => {
  const hashSum = getHashSumFromSequence(initializationSequence);

  console.log(hashSum);
};

const getHashSumFromSequence = (sequence) =>
  sequence.reduce((sum, sequence) => sum + HASH_algorithm(sequence), 0);

const HASH_algorithm = (str) =>
  str
    .split('')
    .reduce(
      (currentValue, char) => ((currentValue + char.charCodeAt()) * 17) % 256,
      0
    );

module.exports = () => run(day, onLineRead, onClose);
