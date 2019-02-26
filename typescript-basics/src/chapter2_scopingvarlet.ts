function f(shouldInitialize: boolean) {
  var x;
  if (shouldInitialize) {
    x = 10;
  }
  return x;
}
console.log(f(true)); // returns '10'
console.log(f(false)); // returns 'undefined'

/* */
try {
  throw 'oh no!';
} catch (e) {
  console.log('Oh well.');
}
// Error: 'e' doesn't exist here
// console.log(e);

/* */
function foo() {
  // okay to capture 'a'
  return a;
}

// illegal call 'foo' before 'a' is declared
// runtimes should throw an error here
foo(); // ReferenceError: a is not defined
// let a; // Error. a has already been declared
