const fs = require('fs');
const readline = require('readline');
const path = require('path');

const almanac = [];

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_5.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (inputLine) => {
    almanac.push(inputLine);
  }).on('close', () => {
    const seeds = getSeeds(almanac);
    const maps = getMaps(almanac);
    const locations = getLocations(seeds, maps);

    console.table(getLowestLocation(locations));
  });
};

const getSeeds = (almanac) => {
  return almanac[0].split(' ').filter(Number).map(Number);
};

const getMaps = (almanac) => {
  const mapLines = almanac.filter(
    (line) => Boolean(line) && !line.includes('seeds')
  );

  return mapLines.reduce((maps, data) => {
    const isMapLine = data.includes('map');

    isMapLine
      ? maps.push([])
      : maps[maps.length - 1]?.push(data.split(' ').map(Number));

    return maps;
  }, []);
};

const getLowestLocation = (locations) => {
  return locations.reduce(
    (lowestLocation, location) =>
      location < lowestLocation ? location : lowestLocation,
    Infinity
  );
};

const getLocations = (seeds, maps) => {
  return seeds.map((seed) => {
    maps.forEach((map) => {
      const correctRange = getCorrectRange(seed, map);

      if (correctRange) {
        seed = mapSeed(seed, correctRange);
      }
    });

    return seed;
  });
};

const getCorrectRange = (seed, map) => {
  return map.reduce(
    (correctRange, range) =>
      seed >= range[1] && seed < range[1] + range[2] ? range : correctRange,
    null
  );
};

const mapSeed = (seed, range) => {
  const [destinationStart, sourceStart] = range;
  return destinationStart + (seed - sourceStart);
};

run();
