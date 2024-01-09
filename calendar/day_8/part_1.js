const fs = require('fs');
const readline = require('readline');
const path = require('path');

let instructions = '';
const nodes = new Map();
const startingNode = 'AAA';
const endingNode = 'ZZZ';

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_8.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (inputLine) => {
    if (!instructions) {
      instructions = inputLine;
      return;
    }

    if (!inputLine) {
      return;
    }

    const [nodeId, nextNodes] = inputLine.split(' = ');
    const nextNodeMap = createNextNodeMap(nextNodes);

    nodes.set(nodeId, nextNodeMap);
  }).on('close', () => {
    const stepCount = calculateStepCount();
    console.log(stepCount);
  });
};

const createNextNodeMap = (nextNodesInput) => {
  const nextNodes = nextNodesInput
    .substring(1, nextNodesInput.length - 1)
    .split(', ');
  const nextNodeMap = { L: nextNodes[0], R: nextNodes[1] };

  return nextNodeMap;
};

const calculateStepCount = () => {
  let stepCount = 0;

  for (
    let currentNode = startingNode;
    currentNode !== endingNode;
    stepCount++
  ) {
    const currentInstruction = instructions[stepCount % instructions.length];
    const nextNode = nodes.get(currentNode)[currentInstruction];
    currentNode = nextNode;
  }

  return stepCount;
};

run();
