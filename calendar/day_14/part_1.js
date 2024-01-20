const run = require('../../run');

const day = 14;

const inputLines = [];
const cubeRock = '#';
const roundRock = 'O';
let load = 0;

const onLineRead = (inputLine) => {
  inputLines.push(inputLine);
};

const onClose = () => {
  const rockColumns = transposeRockLines(inputLines);
  const tiltedRockColumns = tiltRockLines(rockColumns);
  const columnLoads = getLineLoads(tiltedRockColumns);
  const load = columnLoads.reduce((load, columnLoad) => load + columnLoad, 0);

  console.log(load);
};

const getLineLoads = (rockLines) => {
  return rockLines.map((line) => {
    const lineLoad = line.split('').reduce((load, fieldType, index) => {
      return fieldType === roundRock ? load + line.length - index : load;
    }, 0);

    return lineLoad;
  });
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
