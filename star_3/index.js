const fs = require('fs');
const readline = require('readline');
const path = require('path');

const MAX_CUBE_COUNT = {
  red: 12,
  green: 13,
  blue: 14,
};

const possibleGameIds = [];

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../inputs/day_2.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (input) => {
    const gameSets = getGameSets(input);
    const gameCubeDraws = gameSets.map(getGameCubeDraws).flat();

    const isGamePossible = gameCubeDraws.every(
      ([cubeCount, cubeColor]) => cubeCount <= MAX_CUBE_COUNT[cubeColor]
    );

    if (isGamePossible) {
      possibleGameIds.push(getGameId(input));
    }
  }).on('close', () => {
    console.log(possibleGameIds.reduce((sum, id) => sum + Number(id), 0));
  });
};

const getGameSets = (gameInput) => {
  const firstSetIndex = gameInput.indexOf(':');
  return gameInput.slice(firstSetIndex + 2).split('; ');
};

const getGameCubeDraws = (gameSet) => {
  return gameSet.split(', ').map((cubeDraw) => cubeDraw.split(' '));
};

const getGameId = (gameInput) => {
  const firstSpaceIndex = gameInput.indexOf(' ');
  const firstColonIndex = gameInput.indexOf(':');
  return gameInput.slice(firstSpaceIndex + 1, firstColonIndex);
};

run();
