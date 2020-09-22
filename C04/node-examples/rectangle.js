module.exports = (x, y, cb) => {
  if (x <= 0 || y <= 0) {
    let msg = `Rectangle dimensions should be greater than 0, len=${x} and width:${y}`;
    setTimeout(() => cb(new Error(msg), null),
               2000);
  }
  else {
    setTimeout(() => cb(null,
                        {
                          perimeter: () => 2 * (x + y),
                          area: () => x * y
                        }),
               2000);
  }
}
