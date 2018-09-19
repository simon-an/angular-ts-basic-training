const sym: unique symbol = Symbol('foobar');

let obj27 = {
  [sym]: 'value'
};

console.log(obj27[sym]); // "value"
console.log(sym === Symbol.for('foobar')); // "value"

const getClassNameSymbol = Symbol();

class C {
  [getClassNameSymbol]() {
    return 'C';
  }
}

let c27 = new C();
let className = c27[getClassNameSymbol](); // "C"
console.log(className);
