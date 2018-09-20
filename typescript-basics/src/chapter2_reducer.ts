let result = 0;
[1, 2, 3, 4].forEach(number => result += number);
console.log(result);

// Pure Function
const reducer = (sum: number, value: number) => sum += value;
console.log([1, 2, 3, 4].reduce(reducer, 0));