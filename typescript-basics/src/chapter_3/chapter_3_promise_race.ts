let promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

let promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then(function(value) {
  console.log(value);
  // Both resolve, but promise2 is faster
});
// expected output: "two"