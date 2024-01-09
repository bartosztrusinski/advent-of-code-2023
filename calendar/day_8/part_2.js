const fs = require('fs');
const readline = require('readline');
const path = require('path');

let instructions = '';
const nodes = new Map();
const startingNodes = [];

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

    if (nodeId.at(-1) === 'A') {
      startingNodes.push(nodeId);
    }

    nodes.set(nodeId, nextNodeMap);
  }).on('close', () => {
    const stepCount = getStepCount();
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

const getStepCount = () => {
  const nodeStepCounts = [];

  for (
    let stepCount = 0, currentNodes = startingNodes;
    nodeStepCounts.filter(Boolean).length !== startingNodes.length;
    stepCount++
  ) {
    const currentInstruction = instructions[stepCount % instructions.length];
    const nextNodes = currentNodes.map((currentNode, index) => {
      const isFirstEndingNode =
        currentNode.at(-1) === 'Z' && !nodeStepCounts[index];

      if (isFirstEndingNode) {
        nodeStepCounts[index] = stepCount;
      }

      return nodes.get(currentNode)[currentInstruction];
    });
    currentNodes = nextNodes;
  }

  return leastCommonMultiple(...nodeStepCounts);
};

const getGreatestCommonDivisor = (a, b) => {
  return b === 0 ? a : getGreatestCommonDivisor(b, a % b);
};

const leastCommonMultiple = (...numbers) => {
  return numbers.reduce((result, number) => {
    const greatestCommonDivisor = getGreatestCommonDivisor(result, number);
    return (result * number) / greatestCommonDivisor;
  }, 1);
};

run();
