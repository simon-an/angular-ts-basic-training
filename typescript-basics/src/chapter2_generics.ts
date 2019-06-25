// two identity functions with the same functionality but different types for the argument
function identityNumber(arg: number): number {
  console.log(arg);
  return arg;
}
let num: number = identityNumber(2);

function identityString(arg: string): string {
  console.log(arg);
  return arg;
}
let str: string = identityString('bla');

// generic identity function
function identity<T>(arg: T): T {
  console.log(arg);
  return arg;
}

str = identity('bla');
// num = identity('bla'); // error because argument has to be the same type as the variable
num = identity(2);

interface GenericIdentityFn {
  <T>(arg: T): T;
}
let myIdentity: GenericIdentityFn = identity;

class GenericNumber<T> {
  zeroValue!: T;
  add!: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) {
  return x + y;
};

let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = '';
stringNumeric.add = function(x, y) {
  return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, 'test'));

// function loggingIdentity<T>(arg: T): T {
//   console.log(arg.length);  // Error: T doesn't have .length
//   return arg;
// }

interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}

/** **/
class BeeKeeper {
  hasMask!: boolean;
}

class ZooKeeper {
  nametag!: string;
}

class Animal {
  numLegs!: number;
}

class Bee extends Animal {
  keeper!: BeeKeeper;
}

class Lion extends Animal {
  keeper!: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag; // typechecks!
createInstance(Bee).keeper.hasMask; // typechecks!
