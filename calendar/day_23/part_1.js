const run = require('../../run');

const day = 23;

const map = [];
const pathChar = '.';
const slopeChars = { left: '<', right: '>', down: 'v' };

const onLineRead = (inputLine) => {
  map.push(inputLine);
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
      !visitMap.has(`${row},${column}`) &&
      (map[row][column] === pathChar ||
        map[row][column] === slopeChars[direction])
  );
};

module.exports = () => run(day, onLineRead, onClose);
