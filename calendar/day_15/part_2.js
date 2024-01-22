const run = require('../../run');

const day = 15;

const initializationSequence = [];
const boxCount = 255;
const lensBoxes = Array.from({ length: boxCount });

const onLineRead = (inputLine) => {
  initializationSequence.push(...inputLine.split(','));
};

const onClose = () => {
  for (const sequence of initializationSequence) {
    const focalLength = Number(sequence.at(-1));
    const label = sequence.slice(0, focalLength ? -2 : -1);
    const correctBoxIndex = HASH_algorithm(label);
    const operationType = focalLength ? '=' : '-';

    if (!lensBoxes[correctBoxIndex]) {
      lensBoxes[correctBoxIndex] = new Map();
    }

    if (operationType === '-') {
      lensBoxes[correctBoxIndex].delete(label);
    } else {
      lensBoxes[correctBoxIndex].set(label, focalLength);
    }
  }

  const focusingPowerSum = lensBoxes.reduce((sum, box, boxIndex) => {
    return box ? sum + getBoxFocusingPower(box, boxIndex) : sum;
  }, 0);

  console.log(focusingPowerSum);
};

const getBoxFocusingPower = (box, boxIndex) => {
  return [...box].reduce((focusingPower, [label, focalLength], lensSlot) => {
    return focusingPower + (boxIndex + 1) * (lensSlot + 1) * focalLength;
  }, 0);
};

const HASH_algorithm = (str) =>
  str
    .split('')
    .reduce(
      (currentValue, char) => ((currentValue + char.charCodeAt()) * 17) % 256,
      0
    );

module.exports = () => run(day, onLineRead, onClose);
