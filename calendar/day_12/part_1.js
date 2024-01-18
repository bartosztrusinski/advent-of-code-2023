const run = require('../../run');

const day = 12;

let possibleArrangementCountSum = 0;

const onLineRead = (inputLine) => {
  const [springFormation, rawSpringCounts] = inputLine.split(' ');
  const springCounts = getSpringCounts(rawSpringCounts);

  let currentSpringCount = springCounts[0];
  let arrangements = getArrangements(springFormation, currentSpringCount, 0);

  for (let i = 1; i < springCounts.length; i++) {
    currentSpringCount = springCounts[i];

    const newArrangements = [];
    arrangements.forEach(({ formation, startIndex }) => {
      newArrangements.push(
        ...getArrangements(formation, currentSpringCount, startIndex)
      );
    });

    arrangements = [...newArrangements];
  }

  const possibleArrangementCount = computePossibleArrangementCount(
    arrangements,
    springCounts
  );

  possibleArrangementCountSum += possibleArrangementCount;
};

const computePossibleArrangementCount = (arrangements, springCounts) => {
  const candidateSpringCounts = arrangements.map(({ formation }) =>
    formation
      .replaceAll('?', '.')
      .split('.')
      .filter(Boolean)
      .map((s) => s.length)
  );

  const correctSpringCounts = candidateSpringCounts.filter(
    (springArrangement) =>
      springCounts.every(
        (count, countIndex) =>
          count === springArrangement[countIndex] &&
          springCounts.length === springArrangement.length
      )
  );

  return correctSpringCounts.length;
};

const onClose = () => {
  console.log(possibleArrangementCountSum);
};

const getSpringCounts = (rawSpringCounts) => {
  return rawSpringCounts.split(',').map(Number);
};

const getArrangements = (springFormation, candidateFieldLength, startIndex) => {
  const formationRange = createRange(
    startIndex,
    springFormation.length - candidateFieldLength
  );

  return formationRange.reduce((arrangements, formationIndex) => {
    if (
      !isPossibleArrangement(
        springFormation,
        formationIndex,
        formationIndex + candidateFieldLength
      )
    ) {
      return arrangements;
    }

    const candidateArrangement = {
      startIndex: formationIndex + 1,
      formation: getCandidateFormation(
        springFormation,
        formationIndex,
        formationIndex + candidateFieldLength
      ),
    };

    return [...arrangements, candidateArrangement];
  }, []);
};

const createRange = (startIndex, endIndex) => {
  return Array.from(
    { length: endIndex - startIndex + 1 },
    (_, index) => index + startIndex
  );
};

const isPossibleArrangement = (springFormation, startIndex, endIndex) => {
  const leftSpringField = springFormation[startIndex - 1];
  const rightSpringField = springFormation[endIndex];
  const candidateField = springFormation.substr(
    startIndex,
    endIndex - startIndex
  );

  return (
    candidateField.indexOf('.') === -1 &&
    leftSpringField !== '#' &&
    rightSpringField !== '#'
  );
};

const getCandidateFormation = (springFormation, startIndex, endIndex) => {
  return [...springFormation]
    .map((char, index) =>
      index >= startIndex && index < endIndex ? '#' : char
    )
    .join('');
};

module.exports = () => run(day, onLineRead, onClose);
