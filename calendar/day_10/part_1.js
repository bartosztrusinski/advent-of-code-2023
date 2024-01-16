const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: fs.createReadStream(
    path.resolve(__dirname, '../../inputs/day_10.txt')
  ),
  crlfDelay: Infinity,
});

const northPipes = ['|', '7', 'F'];
const southPipes = ['|', 'J', 'L'];
const westPipes = ['-', 'L', 'F'];
const eastPipes = ['-', '7', 'J'];

const maze = [];
const start = {};

const run = () => {
  rl.on('line', (inputLine) => {
    const mazeLine = inputLine.split('');
    const startX = mazeLine.indexOf('S');

    if (startX !== -1) {
      start.x = startX;
      start.y = maze.length;
    }

    maze.push(mazeLine);
  }).on('close', () => {
    const stepCount = calculateStepCount();
    console.log(stepCount);
  });
};

const getStartingPipes = () => {
  const startingPipes = [];
  const isPathNorth = northPipes.includes(maze[start.y - 1][start.x]);
  const isPathSouth = southPipes.includes(maze[start.y + 1][start.x]);
  const isPathWest = westPipes.includes(maze[start.y][start.x - 1]);
  const isPathEast = eastPipes.includes(maze[start.y][start.x + 1]);

  if (isPathNorth) {
    startingPipes.push({ x: start.x, y: start.y - 1 });
  }

  if (isPathSouth) {
    startingPipes.push({ x: start.x, y: start.y + 1 });
  }

  if (isPathWest) {
    startingPipes.push({ x: start.x - 1, y: start.y });
  }

  if (isPathEast) {
    startingPipes.push({ x: start.x + 1, y: start.y });
  }

  return startingPipes;
};

const findNextPipe = (x, y) => {
  const currentPipe = maze[y][x];
  const surroundingPipes = {
    north: maze[y - 1]?.[x],
    south: maze[y + 1]?.[x],
    west: maze[y][x - 1],
    east: maze[y][x + 1],
  };

  switch (currentPipe) {
    case '|':
      return northPipes.includes(surroundingPipes.north)
        ? { x, y: y - 1 }
        : { x, y: y + 1 };
    case '-':
      return westPipes.includes(surroundingPipes.west)
        ? { x: x - 1, y }
        : { x: x + 1, y };
    case '7':
      return westPipes.includes(surroundingPipes.west)
        ? { x: x - 1, y }
        : { x, y: y + 1 };
    case 'J':
      return westPipes.includes(surroundingPipes.west)
        ? { x: x - 1, y }
        : { x, y: y - 1 };
    case 'L':
      return eastPipes.includes(surroundingPipes.east)
        ? { x: x + 1, y }
        : { x, y: y - 1 };
    case 'F':
      return eastPipes.includes(surroundingPipes.east)
        ? { x: x + 1, y }
        : { x, y: y + 1 };
  }
};

const calculateStepCount = () => {
  let stepCount = 1;
  let [pipe1, pipe2] = getStartingPipes();

  for (; pipe1.x !== pipe2.x || pipe1.y !== pipe2.y; stepCount++) {
    const nextPipe1 = findNextPipe(pipe1.x, pipe1.y);
    const nextPipe2 = findNextPipe(pipe2.x, pipe2.y);

    maze[pipe1.y][pipe1.x] = stepCount;
    maze[pipe2.y][pipe2.x] = stepCount;

    pipe1 = nextPipe1;
    pipe2 = nextPipe2;
  }

  return stepCount;
};

run();
