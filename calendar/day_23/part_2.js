const run = require('../../run');

const day = 23;

const map = [];
const pathChar = '.';
const slopeChars = { left: '<', right: '>', down: 'v' };
const minStepCount = 6300; // log only the longest routes until it logs the longest one

const onLineRead = (inputLine) => {
  map.push(
    inputLine
      .split('')
      .map((char) =>
        Object.values(slopeChars).includes(char) ? pathChar : char
      )
      .join('')
  );
};

const onClose = () => {
  const startPosition = { row: 0, column: 1 };
  const endPosition = { row: map.length - 1, column: map[0].length - 2 };
  const visitMap = new Map();

  const possibleRoutes = getPossibleRoutes(
    startPosition,
    visitMap,
    0,
    endPosition
  );

  const longestPossibleRoute = Math.max(...possibleRoutes);

  console.log(longestPossibleRoute);
};

const getPossibleRoutes = (
  { row, column },
  visitMap,
  stepCount,
  endPosition
) => {
  let possiblePaths = [];

  if (visitMap.has(`${row},${column}`)) {
    return null;
  }

  visitMap.set(`${row},${column}`, true);

  while (true) {
    possiblePaths = getPossiblePaths({ row, column }, map, visitMap);

    if (possiblePaths.length !== 1) {
      break;
    }

    row = possiblePaths[0].row;
    column = possiblePaths[0].column;

    visitMap.set(`${row},${column}`, true);
    stepCount++;

    if (row === endPosition.row && column === endPosition.column) {
      if (stepCount > minStepCount) console.log(stepCount); // log only the longest routes until it logs the longest one
      return stepCount;
    }
  }

  return possiblePaths
    .map((path) =>
      getPossibleRoutes(path, new Map(visitMap), stepCount + 1, endPosition)
    )
    .flat();
};

const getPossiblePaths = ({ row, column }, map, visitMap) => {
  return [
    { row: row - 1, column, direction: 'up' },
    { row: row + 1, column, direction: 'down' },
    { row, column: column - 1, direction: 'left' },
    { row, column: column + 1, direction: 'right' },
  ].filter(
    ({ row, column, direction }) =>
      map[row] &&
      map[row][column] &&
      map[row][column] === pathChar &&
      !visitMap.has(`${row},${column}`)
  );
};

module.exports = () => run(day, onLineRead, onClose);
