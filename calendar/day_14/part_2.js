const run = require('../../run');

const day = 14;

const inputLines = [];
const cubeRock = '#';
const roundRock = 'O';
const cycleCount = 1000; // 1000000000
const cycleLoads = [];

const onLineRead = (inputLine) => {
  inputLines.push(inputLine);
};

const onClose = () => {
  let rockLines = inputLines;

  for (let i = 0; i < cycleCount; i++) {
    rockLines = tiltCycleRockLines(rockLines);

    const northLineLoads = getNorthLineLoads(rockLines);
    const load = northLineLoads.reduce((load, lineLoad) => load + lineLoad, 0);
    cycleLoads.push(load);
  }

  // do not need to run whole billion cycles
  // find out when cycle repeats and calculate the billionth cycle load
  console.table(cycleLoads);
};

const getNorthLineLoads = (rockLines) => {
  return getNorthRockLines(rockLines).map((line) => {
    const lineLoad = line.split('').reduce((load, fieldType, index) => {
      return fieldType === roundRock ? load + line.length - index : load;
    }, 0);

    return lineLoad;
  });
};

const tiltCycleRockLines = (rockLines) => {
  const northRockLines = getNorthRockLines(rockLines);
  const tiltedNorthRockLines = tiltRockLines(northRockLines);

  const westRockLines = getWestRockLines(tiltedNorthRockLines);
  const tiltedWestRockLines = tiltRockLines(westRockLines);

  const southRockLines = getSouthRockLines(tiltedWestRockLines);
  const tiltedSouthRockLines = tiltRockLines(southRockLines);

  const eastRockLines = getEastRockLines(tiltedSouthRockLines);
  const tiltedEastRockLines = tiltRockLines(eastRockLines);

  return revertOriginRockLines(tiltedEastRockLines);
};

const getNorthRockLines = (rockLines) => {
  return transposeRockLines(rockLines);
};

const getWestRockLines = (northRockLines) => {
  return transposeRockLines(northRockLines);
};

const getSouthRockLines = (westRockLines) => {
  return transposeRockLines(westRockLines).map((line) => reverseRockLine(line));
};

const getEastRockLines = (southRockLines) => {
  return transposeRockLines(
    southRockLines.map((line) => reverseRockLine(line))
  ).map((line) => reverseRockLine(line));
};

const revertOriginRockLines = (eastRockLines) => {
  return eastRockLines.map((line) => reverseRockLine(line));
};

const reverseRockLine = (rockLine) => {
  return rockLine.split('').toReversed().join('');
};

const tiltRockLines = (rockLines) => {
  return rockLines.map((line) => {
    const lineBlocks = line.split(cubeRock);

    const tiltedLineBlocks = lineBlocks.map((block) =>
      block.split('').sort().toReversed().join('')
    );

    return tiltedLineBlocks.join(cubeRock);
  });
};

const transposeRockLines = (inputLines) => {
  return transposeArray(inputLines.map((line) => line.split(''))).map(
    (column) => column.join('')
  );
};

const transposeArray = (array) => {
  return array[0].map((col, i) => array.map((row) => row[i]));
};

module.exports = () => run(day, onLineRead, onClose);
