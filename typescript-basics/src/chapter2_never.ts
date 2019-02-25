function doStuff(): void {
  // this cannot be of type never!
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

function smnFn(x: string | number): boolean {
  if (typeof x === "string") {
    return true;
  } else if (typeof x === "number") {
    return false;
  }

  // Without a never type we would error :
  // - Not all code paths return a value (strict null checks)
  // - Or Unreachable code detected
  // But because TypeScript understands that `fail` function returns `never`
  // It can allow you to call it as you might be using it for runtime safety / exhaustive checks.
  return fail("Unexhaustive!");
}

function fail(message: string): never {
  throw new Error(message);
}
