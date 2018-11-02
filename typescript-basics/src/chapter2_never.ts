function error(message: string): never {
  throw new Error(message);
}
function doStuff(): void {
  console.log("i did something");
}

function blockthread(val: number): never {
  let counter = 0;
  //   while (counter <= 10000000) {
  while (true) {
    if (counter === 1000000000) {
      process.exit(1);
    }
    // setTimeout(() => {
    //   console.log("i did something");
    // }, 0);
    counter++;
  }
}

// error("bla");
blockthread(2);
error("bla");
