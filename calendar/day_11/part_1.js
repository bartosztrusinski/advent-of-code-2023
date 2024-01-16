const run = require('../../run');

const day = 11;

const space = [];
const galaxyChar = '#';
const emptySpaceChar = '.';

const onLineRead = (inputLine) => {
  const spaceRow = inputLine.split('');

  // Expand empty space rows
  if (!spaceRow.includes(galaxyChar)) {
    space.push([...spaceRow]);
  }

  space.push([...spaceRow]);
};

const onClose = () => {
  const spaceRowSize = space[0].length;
  const galaxyPositions = getGalaxyPositions(spaceRowSize);
  const emptySpaceColumnIndices = getEmptySpaceColumnIndices(
    spaceRowSize,
    galaxyPositions
  );

  // Expand empty space columns
  space.forEach((spaceRow) => {
    emptySpaceColumnIndices.forEach((columnIndex, shiftIndex) => {
      spaceRow.splice(columnIndex + shiftIndex, 0, emptySpaceChar);
    });
  });

  const allGalaxiesDistancesSum = getAllGalaxiesDistancesSum();

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

const getAllGalaxiesDistancesSum = () => {
  const expandedSpaceRowSize = space[0].length;
  const expandedSpaceGalaxyPositions = getGalaxyPositions(expandedSpaceRowSize);

  return expandedSpaceGalaxyPositions.reduce(
    (sum, galaxyPosition, galaxyIndex) => {
      const galaxyDistanceMap = getGalaxyDistancesFrom(
        galaxyPosition,
        expandedSpaceGalaxyPositions.filter((_, index) => index > galaxyIndex)
      );

      const galaxyDistancesSum = galaxyDistanceMap.reduce(
        (sum, distance) => sum + distance,
        0
      );

      return sum + galaxyDistancesSum;
    },
    0
  );
};

const getGalaxyDistancesFrom = ([currentY, currentX], galaxyPositions) => {
  return galaxyPositions.map(([y, x]) => {
    return Math.abs(currentY - y) + Math.abs(currentX - x);
  });
};

run(day, onLineRead, onClose);
