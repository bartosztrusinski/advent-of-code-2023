const run = require('../../run');

const day = 18;

const digPlan = [];

const onLineRead = (inputLine) => {
  const [direction, metersToDig, trenchColor] = inputLine.split(' ');
  digPlan.push([direction, Number(metersToDig), trenchColor.slice(1, -1)]);
};

const onClose = () => {
  const startPosition = [0, 0];
  let maxLeft = 0;
  let maxRight = 0;
  let maxUp = 0;
  let maxDown = 0;

  for (let i = 0; i < digPlan.length; i++) {
    const [direction, metersToDig] = digPlan[i];

    switch (direction) {
      case 'R':
        startPosition[0] += metersToDig;
        if (startPosition[0] > maxRight) {
          maxRight = startPosition[0];
        }
        break;
      case 'L':
        startPosition[0] -= metersToDig;
        if (startPosition[0] < maxLeft) {
          maxLeft = startPosition[0];
        }
        break;
      case 'U':
        startPosition[1] += metersToDig;
        if (startPosition[1] > maxUp) {
          maxUp = startPosition[1];
        }
        break;
      case 'D':
        startPosition[1] -= metersToDig;
        if (startPosition[1] < maxDown) {
          maxDown = startPosition[1];
        }
        break;
    }
  }

  // console.log(`Width: ${maxRight - maxLeft} Height: ${maxUp - maxDown}`);
  // console.log(`Max left: ${maxLeft} Max right: ${maxRight}`);
  // console.log(`Max up: ${maxUp} Max down: ${maxDown}`);

  const width = maxRight - maxLeft;
  const height = maxUp - maxDown;

  const grid = Array(height * 2)
    .fill()
    .map(() => Array(width * 2).fill('.'));

  let [x, y] = [170, height];

  for (let i = 0; i < digPlan.length; i++) {
    const [direction, metersToDig] = digPlan[i];

    // console.log(
    //   `INDEX: ${i} Direction: ${direction} Meters to dig: ${metersToDig} X: ${x} Y: ${y}`
    // );

    switch (direction) {
      case 'R':
        for (let j = x; j < x + metersToDig; j++) {
          grid[y][j] = '#';
        }
        x += metersToDig;
        break;
      case 'L':
        for (let j = x; j > x - metersToDig; j--) {
          grid[y][j] = '#';
        }
        x -= metersToDig;
        break;
      case 'D':
        for (let j = y; j < y + metersToDig; j++) {
          grid[j][x] = '#';
        }
        y += metersToDig;
        break;
      case 'U':
        for (let j = y; j > y - metersToDig; j--) {
          grid[j][x] = '#';
        }
        y -= metersToDig;
        break;
    }
  }

  // const idx = 200;

  // console.log(
  //   `first # at
  //   ${grid[idx].findIndex((cell) => cell === '#')}
  //   | last # at ${grid[idx].findLastIndex((cell) => cell === '#')}
  //   RESULT : ${
  //     grid[idx].findIndex((cell) => cell === '#') === -1
  //       ? 0
  //       : grid[idx].findLastIndex((cell) => cell === '#') -
  //         grid[idx].findIndex((cell) => cell === '#') +
  //         1
  //   }`
  // );

  //73111 too high

  const gridWithoutEmptyLines = grid.filter((line) => line.includes('#'));

  const gridWithDigCount = gridWithoutEmptyLines.map((row, i) => {
    const startDigIndices = row
      .map((cell, idx) => (cell === '#' && row[idx - 1] === '.' ? idx : -1))
      .filter((idx) => idx !== -1);

    const endDigIndices = row
      .map((cell, idx) => (cell === '#' && row[idx + 1] === '.' ? idx : -1))
      .filter((idx) => idx !== -1);

    let isInside = false;

    const points1 = [];
    const points2 = [];

    startDigIndices.forEach((startIndex, index) => {
      const endIndex = endDigIndices[index];

      if (startIndex === endIndex) {
        isInside = !isInside;
        points1.push(startIndex);
        return;
      }

      if (
        gridWithoutEmptyLines[i - 1]?.[startIndex] ===
          gridWithoutEmptyLines[i + 1]?.[endIndex] ||
        gridWithoutEmptyLines[i + 1]?.[startIndex] ===
          gridWithoutEmptyLines[i - 1]?.[endIndex]
      ) {
        isInside = !isInside;
        points1.push([startIndex, endIndex]);
        return;
      }

      if (!isInside) {
        points2.push([startIndex, endIndex]);
      }
      // if start === end TRUE
      // if start^ and endV OR startV and end^ TRUE
      // FALSE
    });

    // const points1 = points.filter((point) => typeof point === 'number');
    // .reduce((sum, point, index) => {
    //   if (index % 2 === 0) {
    //     return sum;
    //   }
    let points1Sum = 0;
    for (let i = 0; i < points1.length; i += 2) {
      const start = typeof points1[i] === 'number' ? points1[i] : points1[i][0];
      const end =
        typeof points1[i + 1] === 'number' ? points1[i + 1] : points1[i + 1][1];

      points1Sum += end - start + 1;
    }

    // if start === end TRUE
    // if start^ and endV OR startV and end^ TRUE
    // FALSE

    // if (point === points[index + 1]) {
    //   return sum;
    //

    //   return sum + (point - points[index - 1] + 1);
    // }, 0);
    const points2Sum = points2
      .filter((point) => Array.isArray(point))
      .map((point) => point[1] - point[0] + 1)
      .reduce((a, b) => a + b, 0);

    // loop
    // if start === end => ITS A POINT
    // if start !== end => ITS A LINE
    // if line start and end go in the same direction => COUNT LINE LENGTH
    // if line start and end go in the opposite direction => COUNT LINE LENGTH

    // #........#............#............#.........#.#.........#.........#
    // #........#............###..........#.........###.........######....#  <= THIS LINE
    // #........#..............#..........#..........................#....#
    //                                                          ^ line changes inside to outside and vice versa
    // ^ point  ^ point       ^ line changes inside to outside and vice versa
    //                                    ^ point   ^line but doesnt change inside/outside

    // SO OUTPUT SHOULD COUNT LIKE THAT
    // ##########............##############.........###.........###########
    // ##########............##############.........###.........###########  <= THIS LINE
    // ##########..............############..........................######

    // if (i === idx) {
    //   console.log(`INDEX ${idx}`);
    //   console.log(`START: ${startDigIndices}`);
    //   console.log(`END: ${endDigIndices}`);
    //   console.log(
    //     startDigIndices.reduce((sum, start, index) => {
    //       if (index % 2 === 1 || !endDigIndices[index + 1]) {
    //         return sum;
    //       }

    //       return sum + (endDigIndices[index + 1] - start + 1);
    //     }, 0)
    //   );
    //   console.log(
    //     row
    //       .filter(
    //         (_, index) =>
    //           index >= startDigIndices[0] &&
    //           index <= endDigIndices[endDigIndices.length - 1]
    //       )
    //       .join('')
    //   );

    //   console.log(`POINTS1: ${points1} POINTS 2: ${points2}`);
    //   console.log(`POINTS1 SUM: ${points1Sum} POINTS 2 SUM: ${points2Sum}`);
    // }

    // return startDigIndices.reduce((sum, start, index) => {
    //   if (index % 2 === 1 || !endDigIndices[index + 1]) {
    //     return sum;
    //   }

    //   return sum + (endDigIndices[index + 1] - start + 1);
    // }, 0);

    return points1Sum + points2Sum;
  });

  const totalMetersDig = gridWithDigCount.reduce((a, b) => a + b, 0);

  console.log(totalMetersDig);

  // const l = 200;

  // console.log(
  //   gridWithoutEmptyLines
  //     .filter((_, i) => i >= 199 && i <= 201)
  //     .map((row, i) => i + row.join('').slice(l, l + 180))
  //     .join('\n')
  // );
};

module.exports = () => run(day, onLineRead, onClose);
