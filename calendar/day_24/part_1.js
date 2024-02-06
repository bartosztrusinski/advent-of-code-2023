const run = require('../../run');

const day = 24;

const linearFunctions = [];
const criteria = {
  min: 200000000000000,
  max: 400000000000000,
};

const onLineRead = (inputLine) => {
  const [axes, delta] = inputLine.split(' @ ');
  const [x, y, z] = axes.split(', ').map(Number);
  const [deltaX, deltaY, deltaZ] = delta.split(', ').map(Number);

  const a = deltaY / deltaX;
  const b = y - x * a;

  const linearFunction = { a, b, x, y, deltaX, deltaY };

  linearFunctions.push(linearFunction);
};

const onClose = () => {
  console.table(linearFunctions);

  let intersectionCount = 0;

  linearFunctions.forEach((fn1, fnIndex) => {
    linearFunctions
      .filter((_, index) => index > fnIndex)
      .forEach((fn2) => {
        const newB = fn2.b - fn1.b; // 4
        const newA = fn1.a - fn2.a; // 0

        if (newA === 0) {
          return;
        }

        intersectionX = newB * (1 / newA); // -21.5 / -0.66666
        intersectionY = fn1.a * intersectionX + fn1.b;

        if (
          intersectionX >= criteria.min &&
          intersectionX <= criteria.max &&
          intersectionY >= criteria.min &&
          intersectionY <= criteria.max &&
          (fn1.deltaX > 0 ? intersectionX >= fn1.x : intersectionX <= fn1.x) &&
          (fn1.deltaY > 0 ? intersectionY >= fn1.y : intersectionY <= fn1.y) &&
          (fn2.deltaX > 0 ? intersectionX >= fn2.x : intersectionX <= fn2.x) &&
          (fn2.deltaY > 0 ? intersectionY >= fn2.y : intersectionY <= fn2.y)
        ) {
          intersectionCount++;
        }
      });
  });

  console.log(intersectionCount);
};

module.exports = () => run(day, onLineRead, onClose);
