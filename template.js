const createPartFromTemplate = (dayNumber) => `const run = require('../../run');

const day = ${dayNumber};

const onLineRead = (inputLine) => {};

const onClose = () => {};

module.exports = () => run(day, onLineRead, onClose);`;

module.exports = createPartFromTemplate;
