const run = require('../../run');

const day = 16;

const emptySpace = '.';
const splitters = { horizontal: '-', vertical: '|' };
const mirrors = { leaningRight: '/', leaningLeft: '\\' };
const directions = { right: 'right', left: 'left', up: 'up', down: 'down' };
const contraption = [];

const onLineRead = (inputLine) => {
  contraption.push(inputLine);
};

const createMatrix = (rows, columns, defaultValue = null) => {
  return Array(rows)
    .fill()
    .map(() => Array(columns).fill(defaultValue));
};

const onClose = () => {
  const tileEnergyLevels = getTileEnergyLevels();
  const energizedTileCount = tileEnergyLevels.flat().filter(Boolean).length;

  console.log(energizedTileCount);
};

const getTileEnergyLevels = (
  startingPosition = { row: 0, column: 0 },
  startingDirection = directions.right
) => {
  const tileEnergyLevels = createMatrix(
    contraption.length,
    contraption[0].length
  );

  energizeTiles(startingPosition, startingDirection, tileEnergyLevels);

  return tileEnergyLevels.map((row) =>
    row.map((tile) => (tile ? tile.size : 0))
  );
};

const energizeTiles = (position, direction, tileEnergyLevels) => {
  const { row, column } = position;
  const tile = contraption[row]?.[column];

  if (!tile) {
    return;
  }

  if (!tileEnergyLevels[row][column]) {
    tileEnergyLevels[row][column] = new Set();
  }

  if (tileEnergyLevels[row][column].has(direction)) {
    return;
  }

  tileEnergyLevels[row][column].add(direction);

  if (
    tile === emptySpace ||
    ((direction === directions.right || direction === directions.left) &&
      tile === splitters.horizontal) ||
    ((direction === directions.up || direction === directions.down) &&
      tile === splitters.vertical)
  ) {
    const nextPosition =
      direction === directions.up
        ? { row: row - 1, column }
        : direction === directions.down
        ? { row: row + 1, column }
        : direction === directions.left
        ? { row, column: column - 1 }
        : { row, column: column + 1 };

    energizeTiles(nextPosition, direction, tileEnergyLevels);
    return;
  }

  if (tile === mirrors.leaningLeft) {
    const nextPosition =
      direction === directions.up
        ? { row, column: column - 1 }
        : direction === directions.down
        ? { row, column: column + 1 }
        : direction === directions.left
        ? { row: row - 1, column }
        : { row: row + 1, column };

    const newDirection =
      direction === directions.up
        ? directions.left
        : direction === directions.down
        ? directions.right
        : direction === directions.left
        ? directions.up
        : directions.down;

    energizeTiles(nextPosition, newDirection, tileEnergyLevels);
    return;
  }

  if (tile === mirrors.leaningRight) {
    const nextPosition =
      direction === directions.up
        ? { row, column: column + 1 }
        : direction === directions.down
        ? { row, column: column - 1 }
        : direction === directions.left
        ? { row: row + 1, column }
        : { row: row - 1, column };

    const newDirection =
      direction === directions.up
        ? directions.right
        : direction === directions.down
        ? directions.left
        : direction === directions.left
        ? directions.down
        : directions.up;

    energizeTiles(nextPosition, newDirection, tileEnergyLevels);
    return;
  }

  if (tile === splitters.horizontal) {
    const leftPosition = { row, column: column - 1 };
    const rightPosition = { row, column: column + 1 };

    energizeTiles(leftPosition, directions.left, tileEnergyLevels);
    energizeTiles(rightPosition, directions.right, tileEnergyLevels);
    return;
  }

  if (tile === splitters.vertical) {
    const upPosition = { row: row - 1, column };
    const downPosition = { row: row + 1, column };

    energizeTiles(upPosition, directions.up, tileEnergyLevels);
    energizeTiles(downPosition, directions.down, tileEnergyLevels);
    return;
  }
};

module.exports = () => run(day, onLineRead, onClose);
