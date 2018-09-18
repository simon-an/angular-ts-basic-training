let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]

let o = {
  a: 'foo',
  b: 12,
  c: 'bar'
};
const { a, c } = o;
console.log(c, a);

let { a: newName1, b: newName2 } = o;
console.log(newName1, newName2);
