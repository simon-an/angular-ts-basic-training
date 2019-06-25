const resultArray = [];
const initialArray = [1, 2, 3, 4];
for (let index = 0; index < initialArray.length; index++) {
  if (initialArray[index] * 100 > 200) {
    resultArray.push(initialArray[index] * 100);
    // resultArray[index] = initialArray[index] * 100;
  }
}
console.log(resultArray);

console.log([1, 2, 3, 4].map(num => num * 100).filter(value => value > 200));
