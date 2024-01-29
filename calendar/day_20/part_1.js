const run = require('../../run');

const day = 20;

const buttonsToPush = 1000;
const initialModules = [];
const pulseTypes = { low: 'low', high: 'high' };
const pulseCount = { low: 0, high: 0 };
const moduleTypes = {
  flipFlop: '%',
  conjunction: '&',
  broadcaster: 'broadcaster',
};
const startQueue = [
  { moduleName: moduleTypes.broadcaster, pulseType: pulseTypes.low },
];

const onLineRead = (inputLine) => {
  const initialModule = getInitialModule(inputLine);
  initialModules.push(initialModule);
};

const onClose = () => {
  const modules = getModules(initialModules);

  for (let i = 0; i < buttonsToPush; i++) {
    pulseCount[pulseTypes.low]++;
    pushModuleButton(modules, startQueue);
  }

  console.log(pulseCount.low * pulseCount.high);
};

const getInitialModule = (inputLine) => {
  const [moduleInput, destinationsInput] = inputLine.split(' -> ');
  const destinations = destinationsInput.split(', ');
  const isBroadcaster = moduleInput === moduleTypes.broadcaster;
  const type = isBroadcaster ? moduleTypes.broadcaster : moduleInput[0];
  const name = isBroadcaster
    ? moduleTypes.broadcaster
    : moduleInput.substring(1);

  return { name, type, destinations };
};

const getModules = (initialModules) => {
  const modules = new Map();

  initialModules
    .map((module) => {
      switch (module.type) {
        case moduleTypes.flipFlop:
          return { ...module, lastPulse: pulseTypes.low };
        case moduleTypes.conjunction:
          const inputs = initialModules
            .filter((initModule) =>
              initModule.destinations.includes(module.name)
            )
            .map((module) => module.name);
          return { ...module, inputs };
        default:
          return module;
      }
    })
    .forEach((module) => {
      modules.set(module.name, module);
      delete module.name;
    });

  return modules;
};

const pushModuleButton = (modules, queue) => {
  let nextQueue = [];

  while (queue.length > 0) {
    nextQueue = [];

    queue.forEach(({ moduleName, pulseType }) => {
      const module = modules.get(moduleName);

      if (
        !module ||
        (module.type === moduleTypes.flipFlop && pulseType === pulseTypes.high)
      ) {
        return;
      }

      const newPulseType = getNewPulseType(module, modules, pulseType);
      const queueItems = module.destinations.map((destination) => ({
        moduleName: destination,
        pulseType: newPulseType,
      }));

      module.lastPulse = newPulseType;
      nextQueue.push(...queueItems);
      pulseCount[newPulseType] += queueItems.length;
    });

    queue = nextQueue;
  }
};

const getNewPulseType = (module, modules, pulseType) => {
  if (module.type === moduleTypes.flipFlop) {
    return module.lastPulse === pulseTypes.low
      ? pulseTypes.high
      : pulseTypes.low;
  }

  if (module.type === moduleTypes.conjunction) {
    return module.inputs.every(
      (input) => modules.get(input).lastPulse === pulseTypes.high
    )
      ? pulseTypes.low
      : pulseTypes.high;
  }

  return pulseType;
};

module.exports = () => run(day, onLineRead, onClose);
