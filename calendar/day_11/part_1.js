const run = require('../../run');

const day = 11;

const space = [];
const galaxyChar = '#';
const expansionFactor = 1;

const onLineRead = (inputLine) => {
  space.push(inputLine.split(''));
};

const onClose = () => {
  const spaceRowSize = space[0].length;
  const galaxyPositions = getGalaxyPositions(spaceRowSize);
  const emptySpaceColumnIndices = getEmptySpaceColumnIndices(
    spaceRowSize,
    galaxyPositions
  );
  const emptySpaceRowIndices = getEmptySpaceRowIndices(galaxyPositions);

  const galaxyPositionsAfterExpansion = computeGalaxyPositionsAfterExpansion(
    galaxyPositions,
    emptySpaceColumnIndices,
    emptySpaceRowIndices
  );

  const allGalaxiesDistancesSum = getGalaxiesDistancesSum(
    galaxyPositionsAfterExpansion
  );

  console.log(allGalaxiesDistancesSum);
};

const getGalaxyPositions = (spaceRowSize) => {
  const flatSpace = space.flat();

  const galaxyCoordinates = flatSpace
    .map((char, index) =>
      char === galaxyChar
        ? [Math.floor(index / spaceRowSize), index % spaceRowSize]
        : null
    )
    .filter(Boolean);

  return galaxyCoordinates;
};

const getEmptySpaceColumnIndices = (spaceRowSize, galaxyPositions) => {
  return Array.from({ length: spaceRowSize }, (_, index) => index).filter(
    (columnIndex) => !galaxyPositions.some(([_, x]) => x === columnIndex)
  );
};

const getEmptySpaceRowIndices = (galaxyPositions) => {
  return space
    .map((_, index) => index)
    .filter((rowIndex) => !galaxyPositions.some(([y]) => y === rowIndex));
};

const computeGalaxyPositionsAfterExpansion = (
  galaxyPositions,
  emptySpaceColumnIndices,
  emptySpaceRowIndices
) => {
  return galaxyPositions.map(([galaxyY, galaxyX]) => {
    const expandedRowsBefore = emptySpaceRowIndices.filter(
      (rowIndex) => rowIndex < galaxyY
    );
    const expandedColumnsBefore = emptySpaceColumnIndices.filter(
      (columnIndex) => columnIndex < galaxyX
    );

    return [
      galaxyY + expandedRowsBefore.length * expansionFactor,
      galaxyX + expandedColumnsBefore.length * expansionFactor,
    ];
  });
};

const getGalaxiesDistancesSum = (galaxyPositions) => {
  return galaxyPositions.reduce((sum, galaxyPosition, galaxyIndex) => {
    const galaxyDistanceMap = getGalaxyDistancesFrom(
      galaxyPosition,
      galaxyPositions.filter((_, index) => index > galaxyIndex)
    );

    const galaxyDistancesSum = galaxyDistanceMap.reduce(
      (sum, distance) => sum + distance,
      0
    );

    return sum + galaxyDistancesSum;
  }, 0);
};

const getGalaxyDistancesFrom = ([currentY, currentX], galaxyPositions) => {
  return galaxyPositions.map(([y, x]) => {
    return Math.abs(currentY - y) + Math.abs(currentX - x);
  });
};

module.exports = () => run(day, onLineRead, onClose);
