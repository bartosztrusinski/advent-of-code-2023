const run = require('../../run');

const day = 17;
const cityHeatMap = [];

const onLineRead = (inputLine) => {
  cityHeatMap.push(inputLine.split('').map(Number));
};

// make sum heat loss from NUMBER to [{NUMBER, DIRECTION, MOVESLEFT}]
// ie 32 => [{32, RIGHT, 2}, {34, DOWN, 1}, {35, LEFT, 0}]
// map?   get(RIGHT) => {value: 32, movesLeft: 2}
// next positions returns this map ehhh
const onClose = () => {
  const startingPosition = [0, 0];
  const [x, y] = startingPosition;
  const sumHeatLoss = Array(cityHeatMap.length)
    .fill(null)
    .map(() => Array(cityHeatMap[0].length).fill(null));

  sumHeatLoss[y][x] = cityHeatMap[y][x];

  let nextPositions = getNextPositions([startingPosition]);

  while (nextPositions.length) {
    console.table(sumHeatLoss);

    const sumHeatLossCopy = JSON.parse(JSON.stringify(sumHeatLoss));

    nextPositions.forEach((nextPosition) =>
      getMinHeatLoss(nextPosition, sumHeatLoss)
    );

    if (JSON.stringify(sumHeatLoss) === JSON.stringify(sumHeatLossCopy)) {
      break;
    }

    nextPositions = getNextPositions(nextPositions);

    // nextPositions = nextPositions.filter(([x, y]) => {
    //   const heatsAround = [
    //     [x + 1, y],
    //     [x - 1, y],
    //     [x, y + 1],
    //     [x, y - 1],
    //   ]
    //     .map(([x, y]) => sumHeatLoss[y]?.[x])
    //     .filter(Boolean);

    //   if (heatsAround.length < 4) {
    //     return true;
    //   }

    //   return heatsAround.some(
    //     (heat) => heat < sumHeatLoss[y][x] + cityHeatMap[y][x]
    //   );
    // });
  }

  // make the same loop again but prevent from going straight longer than 3 times
  // and stop when the sumHeatLoss doesn't change anymore

  console.table(sumHeatLoss);
};

const getNextPositions = (currentPositions) => {
  const nextPositions = currentPositions
    .map(([x, y]) => {
      const positionsAround = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ].filter(([x, y]) => cityHeatMap[y]?.[x] !== undefined);

      return positionsAround;
    })
    .flat();

  const uniqueNextPositions = [...new Set(nextPositions.map(JSON.stringify))];

  return uniqueNextPositions.map(JSON.parse);
};

const getMinHeatLoss = ([x, y], sumHeatLoss) => {
  const heatsAround = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ]
    .map(([x, y]) => sumHeatLoss[y]?.[x])
    .filter(Boolean);

  const minHeatLoss = cityHeatMap[y][x] + Math.min(...heatsAround);

  sumHeatLoss[y][x] = sumHeatLoss[y][x]
    ? Math.min(minHeatLoss, sumHeatLoss[y][x])
    : minHeatLoss;
};

module.exports = () => run(day, onLineRead, onClose);
