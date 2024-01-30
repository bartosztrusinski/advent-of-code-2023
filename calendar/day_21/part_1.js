const run = require('../../run');

const day = 21;

const map = [];
const startingChar = 'S';
const gardenPlot = '.';
const stepsToTake = 64;
const startingPosition = { row: 0, column: 0 };

const onLineRead = (inputLine) => {
  const startingColumn = inputLine.indexOf(startingChar);

  if (startingColumn !== -1) {
    startingPosition.row = map.length;
    startingPosition.column = startingColumn;
  }

  map.push(inputLine);
};

const onClose = () => {
  let currentSteps = [startingPosition];
  const visitedPlots = new Set();
  const viablePlots = new Set();

  visitedPlots.add(`${startingPosition.row},${startingPosition.column}`);
  viablePlots.add(`${startingPosition.row},${startingPosition.column}`);

  for (let i = 0; i < stepsToTake; i++) {
    let nextSteps = [];

    currentSteps.forEach(({ row, column }) => {
      const possibleSteps = [
        { row: row - 1, column },
        { row: row + 1, column },
        { row, column: column - 1 },
        { row, column: column + 1 },
      ].filter(
        ({ row, column }) =>
          map[row]?.[column] === gardenPlot &&
          !visitedPlots.has(`${row},${column}`)
      );

      nextSteps.push(...possibleSteps);

      possibleSteps.forEach(({ row, column }) => {
        visitedPlots.add(`${row},${column}`);

        if (i % 2 === 1) {
          viablePlots.add(`${row},${column}`);
        }
      });
    });

    currentSteps = [...nextSteps];
  }

  console.log(viablePlots.size);
};

module.exports = () => run(day, onLineRead, onClose);
