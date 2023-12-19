const fs = require('fs');
const readline = require('readline');
const path = require('path');

const minimumCubesPowers = [];

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../inputs/day_2.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (input) => {
    const gameSets = getGameSets(input);
    const gameCubeDraws = getGameCubeDraws(gameSets);
    const minimumCubeCounts = getMinimumCubeCounts(gameCubeDraws);
    const minimumCubesPower = getMinimumCubePower(minimumCubeCounts);

    minimumCubesPowers.push(minimumCubesPower);
  }).on('close', () => {
    console.log(minimumCubesPowers.reduce((sum, id) => sum + Number(id), 0));
  });
};

const getGameSets = (gameInput) => {
  const firstSetIndex = gameInput.indexOf(':');
  return gameInput.slice(firstSetIndex + 2).split('; ');
};

const getGameCubeDraws = (gameSets) => {
  return gameSets
    .map((gameSet) =>
      gameSet.split(', ').map((cubeDraw) => cubeDraw.split(' '))
    )
    .flat();
};

const getMinimumCubeCounts = (gameCubeDraws) => {
  return gameCubeDraws.reduce(
    (minimumCubeCounts, [cubeCount, cubeColor]) => ({
      ...minimumCubeCounts,
      [cubeColor]: Math.max(cubeCount, minimumCubeCounts[cubeColor]),
    }),
    { red: 0, green: 0, blue: 0 }
  );
};

const getMinimumCubePower = (minimumCubeCounts) => {
  return Object.values(minimumCubeCounts).reduce(
    (sum, count) => sum * count,
    1
  );
};

run();
