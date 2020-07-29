export const nonBlockingLoop = (func, array, index = 0) => {
  if (index === array.length) {
    return;
  }

  func(array[index]);

  setTimeout(() => {
    nonBlockingLoop(func, array, index + 1);
  });
};
