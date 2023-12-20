const fs = require('fs');
const readline = require('readline');
const path = require('path');

const engineSchematicLines = [];
const gearIndices = new Map();

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_3.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (input) => {
    engineSchematicLines.push(input);
  }).on('close', () => {
    engineSchematicLines.forEach((line, lineIndex) => {
      const engineNumberIndices = getEngineNumberIndices(line);

      engineNumberIndices.forEach(({ start, end, number }) => {
        for (let i = lineIndex - 1; i <= lineIndex + 1; i++) {
          for (let j = start - 1; j < end + 1; j++) {
            if (engineSchematicLines[i]?.[j] === '*') {
              setGearNumber(number, i, j);
            }
          }
        }
      });
    });

    const gearRatios = getGearRatios([...gearIndices.values()]);
    const gearRatioSum = gearRatios.reduce(
      (sum, gearRatio) => sum + gearRatio,
      0
    );

    console.log(gearRatioSum);
  });
};

const getEngineNumberIndices = (inputString) => {
  const indices = [];
  const numberPattern = /\d+/g;
  let match;

  while ((match = numberPattern.exec(inputString)) !== null) {
    indices.push({
      number: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return indices;
};

const getGearRatios = (gearNumbers) => {
  return gearNumbers
    .filter((numbers) => numbers.length === 2)
    .map(
      ([firstNumber, secondNumber]) =>
        Number(firstNumber) * Number(secondNumber)
    );
};

const setGearNumber = (number, start, end) => {
  gearIndices.set(`${start}x${end}`, [
    ...(gearIndices.get(`${start}x${end}`) || []),
    number,
  ]);
};

run();
