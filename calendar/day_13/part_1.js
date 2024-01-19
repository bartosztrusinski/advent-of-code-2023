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
    const rowNotesCount = getNotesCount(pattern, 100);

    if (rowNotesCount) {
      notesSum += rowNotesCount;
    }

    const transposedPattern = transposeArray(
      pattern.map((row) => row.split(''))
    ).map((row) => row.join(''));

    const columnNotesCount = getNotesCount(transposedPattern);

    if (columnNotesCount) {
      notesSum += columnNotesCount;
    }
  }

  console.log(notesSum);
};

const getNotesCount = (pattern, multiplier = 1) => {
  for (let [index, row] of pattern.entries()) {
    if (row !== pattern[index + 1]) {
      continue;
    }

    const delta = Math.min(index, pattern.length - index - 2);

    let startIndex = index - delta;
    let endIndex = index + delta + 1;
    let isMirror = true;

    for (let i = 0; i < delta; i++) {
      if (pattern[startIndex + i] !== pattern[endIndex - i]) {
        isMirror = false;
        break;
      }
    }

    if (isMirror) {
      return multiplier * (index + 1);
    }
  }

  return null;
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
