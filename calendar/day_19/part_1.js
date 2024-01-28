const run = require('../../run');

const day = 19;

const workflows = new Map();
const parts = [];
const acceptRule = 'A';
const rejectRule = 'R';
const startWorkflowName = 'in';

const onLineRead = (inputLine) => {
  if (!inputLine) return;

  if (inputLine[0] === '{') {
    const part = getPart(inputLine);
    parts.push(part);
    return;
  }

  const { workflowName, workflowRules } = getWorkflow(inputLine);
  workflows.set(workflowName, workflowRules);
};

const onClose = () => {
  const acceptedParts = parts.filter((part) =>
    isPartAccepted(part, startWorkflowName)
  );
  const acceptedPartsRatingSum = getAcceptedPartsRatingSum(acceptedParts);

  console.log(acceptedPartsRatingSum);
};

const getAcceptedPartsRatingSum = (acceptedParts) => {
  const acceptedPartsRatingSum = acceptedParts.reduce((partsSum, part) => {
    const ratings = Object.values(part);

    const ratingSum = ratings.reduce((sum, rating) => {
      return sum + rating;
    }, 0);

    return partsSum + ratingSum;
  }, 0);

  return acceptedPartsRatingSum;
};

const getPart = (inputLine) => {
  const partProperties = inputLine.slice(1, -1).split(',');

  const part = partProperties.reduce((part, property) => {
    const [key, value] = property.split('=');
    part[key] = Number(value);
    return part;
  }, {});

  return part;
};

const getWorkflow = (inputLine) => {
  const divider = inputLine.indexOf('{');
  const workflowName = inputLine.substring(0, divider);
  const workflowRules = getWorkflowRules(inputLine, divider);

  return { workflowName, workflowRules };
};

const getWorkflowRules = (inputLine, divider) => {
  const rawWorkflowRules = inputLine.slice(divider + 1, -1).split(',');

  const workflowRules = rawWorkflowRules.reduce((rules, rawRule, index) => {
    const isLastStep = index === rawWorkflowRules.length - 1;

    if (isLastStep) {
      return [...rules, { destination: rawRule }];
    }

    const key = rawRule[0];
    const operation = rawRule[1];
    const divider = rawRule.indexOf(':');
    const value = Number(rawRule.substring(2, divider));
    const destination = rawRule.substring(divider + 1);
    const rule = { key, operation, value, destination };

    return [...rules, rule];
  }, []);

  return workflowRules;
};

const isPartAccepted = (part, workflowName) => {
  if (workflowName === acceptRule) return true;
  if (workflowName === rejectRule) return false;

  const workflow = workflows.get(workflowName);

  for (let i = 0; i < workflow.length; i++) {
    const rule = workflow[i];

    if (!rule.operation) {
      return isPartAccepted(part, rule.destination);
    }

    if (isConditionSatisfied(part, rule)) {
      return isPartAccepted(part, rule.destination);
    }
  }
};

const isConditionSatisfied = (part, rule) => {
  const { key, operation, value } = rule;

  if (operation === '<') {
    return part[key] < value;
  }

  return part[key] > value;
};

module.exports = () => run(day, onLineRead, onClose);
