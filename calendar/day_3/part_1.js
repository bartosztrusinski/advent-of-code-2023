const fs = require('fs');
const readline = require('readline');
const path = require('path');

const engineSchematicLines = [];

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_3.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (input) => {
    engineSchematicLines.push(input);
  }).on('close', () => {
    const partNumbers = engineSchematicLines.map((line, index) => {
      const engineNumberIndices = getEngineNumberIndices(line);
      const enginePartIndices = getEnginePartIndices(
        engineNumberIndices,
        index
      );

      return enginePartIndices.map(({ number }) => number);
    });

    const partNumberSum = partNumbers
      .flat()
      .reduce((sum, partNumber) => sum + parseInt(partNumber), 0);

    console.log(partNumberSum);
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

const getEnginePartIndices = (engineNumberIndices, lineIndex) => {
  return engineNumberIndices.filter(({ start, end }) => {
    const symbolsAbove =
      engineSchematicLines[lineIndex - 1]?.substring(start - 1, end + 1) || [];
    const symbolsBelow =
      engineSchematicLines[lineIndex + 1]?.substring(start - 1, end + 1) || [];
    const symbolsInLine =
      engineSchematicLines[lineIndex]?.substring(start - 1, end + 1) || [];

    const symbols = [...symbolsAbove, ...symbolsBelow, ...symbolsInLine];

    const isPartNumber = symbols.some(
      (symbol) => symbol !== '.' && isNaN(symbol)
    );

    return isPartNumber;
  });
};

run();
