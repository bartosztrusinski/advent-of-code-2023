const run = require('../../run');

const day = 18;

const digPlan = [];

const onLineRead = (inputLine) => {
  const [direction, metersToDig] = inputLine.split(' ');
  digPlan.push([direction, Number(metersToDig)]);
};

const onClose = () => {
  const [width, height, center] = getDigSiteDimensions();
  const digSiteGrid = createDigSiteGrid(width, height, center);
  const totalMetersDig = computeTotalMetersDig(digSiteGrid);

  console.log(totalMetersDig);
};

const getDigSiteDimensions = () => {
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

  const width = maxRight - maxLeft + 1;
  const height = maxUp - maxDown + 1;
  const center = [Math.abs(maxLeft), Math.abs(maxUp)];

  return [width, height, center];
};

const createDigSiteGrid = (width, height, center) => {
  const grid = Array(height)
    .fill()
    .map(() => Array(width).fill('.'));

  let [x, y] = center;

  console.log(`width: ${width}, height: ${height} center: ${center}`);

  for (let i = 0; i < digPlan.length; i++) {
    const [direction, metersToDig] = digPlan[i];

    switch (direction) {
      case 'R':
        for (let j = x; j < x + metersToDig; j++) {
          grid[y] ? (grid[y][j] = '#') : console.log(`x: ${x}, y: ${y}`);
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

  return grid.filter((line) => line.includes('#'));
};

const computeTotalMetersDig = (grid) => {
  return grid
    .map((row, rowIndex) => {
      const startDigIndices = row
        .map((cell, index) =>
          cell === '#' && row[index - 1] && row[index - 1] === '.' ? index : -1
        )
        .filter((index) => index !== -1);

      const endDigIndices = row
        .map((cell, index) =>
          cell === '#' && row[index + 1] && row[index + 1] === '.' ? index : -1
        )
        .filter((index) => index !== -1);

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

        // console.log(`index: ${index} start: ${startIndex} end: ${endIndex} `);
        // console.log(
        //   grid[index - 1]?.[startIndex],
        //   grid[index + 1]?.[endIndex],
        //   grid[index - 1]?.[startIndex] === grid[index + 1]?.[endIndex]
        // );
        // console.log(
        //   grid[index + 1]?.[startIndex],
        //   grid[index - 1]?.[endIndex],
        //   grid[index + 1]?.[startIndex] === grid[index - 1]?.[endIndex]
        // );

        console.log(rowIndex);
        console.log(
          grid[rowIndex - 1]?.join('').slice(startIndex - 1, endIndex + 2)
        );
        console.log(row?.join('').slice(startIndex - 1, endIndex + 2));
        console.log(
          grid[rowIndex + 1]?.join('').slice(startIndex - 1, endIndex + 2)
        );

        if (
          (grid[rowIndex - 1] &&
            grid[rowIndex + 1] &&
            grid[rowIndex - 1]?.[startIndex] ===
              grid[rowIndex + 1]?.[endIndex]) ||
          grid[rowIndex + 1]?.[startIndex] === grid[rowIndex - 1]?.[endIndex]
        ) {
          isInside = !isInside;
          points1.push([startIndex, endIndex]);
          return;
        }

        if (!isInside) {
          points2.push([startIndex, endIndex]);
        }
      });

      let points1Sum = 0;

      console.log(
        `index ${rowIndex} startDigIndices: ${startDigIndices} endDigIndices: ${endDigIndices} \nPOINTS1 ${points1} POINTS2 ${points2}`
      );
      console.log(points1);
      console.log(points2);

      for (let i = 0; i < points1.length; i += 2) {
        console.log(points1[i], points1[i + 1]);
        const start =
          typeof points1[i] === 'number' ? points1[i] : points1[i][0];
        const end =
          typeof points1[i + 1] === 'number'
            ? points1[i + 1]
            : points1[i + 1][1];

        points1Sum += end - start + 1;
      }

      const points2Sum = points2
        .map((point) => point[1] - point[0] + 1)
        .reduce((a, b) => a + b, 0);

      return points1Sum + points2Sum;
    })
    .reduce((sum, rowMetersDig) => sum + rowMetersDig, 0);
};

module.exports = () => run(day, onLineRead, onClose);
