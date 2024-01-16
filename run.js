const fs = require('fs');
const readline = require('readline');
const path = require('path');

const run = (dayNumber, onLineRead, onClose) => {
  console.log(`Running day ${dayNumber}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(
      path.resolve(__dirname, `./inputs/day_${dayNumber}.txt`)
    ),
    crlfDelay: Infinity,
  });

  rl.on('line', (inputLine) => onLineRead(inputLine)).on('close', () =>
    onClose()
  );
};

module.exports = run;
