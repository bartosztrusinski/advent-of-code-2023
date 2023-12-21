const fs = require('fs');
const readline = require('readline');
const path = require('path');

const almanac = [];

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_5.txt')),
  crlfDelay: Infinity,
});

const LOCATIONS_COUNT = 100000000;
const LOCATIONS_START_INDEX = 100000;

const run = () => {
  rl.on('line', (inputLine) => {
    almanac.push(inputLine);
  }).on('close', () => {
    const seedSets = getSeedSets(almanac);
    const maps = getMaps(almanac);
    const candidateLocations = generateCandidateLocations(
      LOCATIONS_COUNT,
      LOCATIONS_START_INDEX
    );
    const candidateSeeds = mapLocationsToSeeds(candidateLocations, maps);
    const lowestLocation = bruteForceLowestLocation(candidateSeeds, seedSets);

    console.log(lowestLocation);
  });
};

const getSeedSets = (almanac) => {
  const seedNumbers = almanac[0].split(' ').filter(Number).map(Number);
  return seedNumbers
    .map((seedNumber, index) =>
      index % 2 === 0 ? [seedNumber, seedNumbers[index + 1]] : null
    )
    .filter(Boolean);
};

const getMaps = (almanac) => {
  const mapLines = almanac.filter(
    (line) => Boolean(line) && !line.includes('seeds')
  );

  return mapLines.reduce((maps, data) => {
    const isMapStartLine = data.includes('map');

    isMapStartLine
      ? maps.push([])
      : maps[maps.length - 1]?.push(data.split(' ').map(Number));

    return maps;
  }, []);
};

const generateCandidateLocations = (candidateCount, startIndex) => {
  return Array.from(
    { length: candidateCount },
    (_, index) => index + startIndex
  );
};

const mapLocationsToSeeds = (locations, maps) => {
  return locations.map((location) => {
    maps.toReversed().forEach((map) => {
      const correctRange = getCorrectRange(location, map);

      if (correctRange) {
        const [destinationStart, sourceStart] = correctRange;
        location = location + (sourceStart - destinationStart);
      }
    });

    return location;
  });
};

const getCorrectRange = (location, map) => {
  return map.reduce(
    (correctRange, range) =>
      location >= range[0] && location < range[0] + range[2]
        ? range
        : correctRange,
    null
  );
};

const bruteForceLowestLocation = (candidateSeeds, seedSets) => {
  let lowestLocation = Infinity;

  for (let [seedIndex, seed] of candidateSeeds.entries()) {
    if (lowestLocation < Infinity) {
      break;
    }

    for (let [seedStart, seedRange] of seedSets) {
      if (seed >= seedStart && seed < seedStart + seedRange) {
        lowestLocation =
          lowestLocation > seedIndex ? seedIndex : lowestLocation;
        break;
      }
    }
  }

  return lowestLocation;
};

run();
