const fs = require('fs');
const path = require('path');
const createPartFromTemplate = require('./template');
const dayNumber = process.argv[2];

const dayDir = path.resolve(__dirname, `./calendar/day_${dayNumber}`);
const part1FilePath = path.resolve(dayDir, `./part_1.js`);
const part2FilePath = path.resolve(dayDir, `./part_2.js`);
const inputFilePath = path.resolve(__dirname, `./inputs/day_${dayNumber}.txt`);

fs.mkdirSync(dayDir);
fs.writeFileSync(part2FilePath, createPartFromTemplate(dayNumber));
fs.writeFileSync(part1FilePath, createPartFromTemplate(dayNumber));
fs.writeFileSync(inputFilePath, '');
