let rect = require('./rectangle');

solveRect = (l, b) => {
  console.log(`\nSolving for rectangle with len=${l} and width=${b}`);

  rect(l, b, (err, rectangle) => {
    if (err) {
      console.log("ERROR: ", err.message);
    }
    else {
      console.log(`=> The area of the rectangle of len: ${l} and width: ${b} is: ${rectangle.area()}`);
      console.log(`=> The perimeter of the rectangle of len: ${l} and width: ${b} is: ${rectangle.perimeter()}`);
    }
  });

  console.log("This statement appears after the call to rect()");
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);
