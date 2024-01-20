const run = require('../../run');

const day = 13;

const inputLines = [];
let notesSum = 0;

const onLineRead = (inputLine) => {
  inputLines.push(inputLine);
};

const onClose = () => {
  const patterns = getPatterns(inputLines);

  for (const pattern of patterns) {
    const rowNotesCount = getNotesCount(pattern, 1, 100);

    if (rowNotesCount) {
      notesSum += rowNotesCount;
      continue;
    }

    const transposedPattern = transposeArray(
      pattern.map((row) => row.split(''))
    ).map((row) => row.join(''));

    const columnNotesCount = getNotesCount(transposedPattern, 1);

    if (columnNotesCount) {
      notesSum += columnNotesCount;
    }
  }

  console.log(notesSum);
};

const getNotesCount = (pattern, possibleDifferences = 0, multiplier = 1) => {
  for (let [index, _] of pattern.entries()) {
    let differenceCount = getDifferenceCount(
      pattern[index],
      pattern[index + 1]
    );

    const delta = Math.min(index, pattern.length - index - 2);

    let startIndex = index - delta;
    let endIndex = index + delta + 1;

    for (let i = 0; i < delta; i++) {
      differenceCount += getDifferenceCount(
        pattern[startIndex + i],
        pattern[endIndex - i]
      );
    }

    if (differenceCount === possibleDifferences) {
      return multiplier * (index + 1);
    }
  }

  return null;
};

const getDifferenceCount = (rowA, rowB) => {
  return rowA
    .split('')
    .filter((charA, index) => charA !== rowB?.split('')[index]).length;
};

const transposeArray = (array) => {
  return array[0].map((col, i) => array.map((row) => row[i]));
};

const getPatterns = (inputLines) => {
  return inputLines.reduce(
    (patterns, inputLine) => {
      if (!inputLine) {
        return [...patterns, []];
      }

      return patterns.map((pattern, index) => {
        const isLastPattern = index === patterns.length - 1;
        return isLastPattern ? [...pattern, inputLine] : pattern;
      });
    },
    [[]]
  );
};

module.exports = () => run(day, onLineRead, onClose);
