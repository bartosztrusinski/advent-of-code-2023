const day = process.argv[2];
const part = process.argv[3];

const executeDay = async () => {
  const dayModule = await import(`./calendar/day_${day}/part_${part}.js`);
  dayModule.default();
};

executeDay();
