let number16: number[] = [1, 2, 3, 4];
let ro16: ReadonlyArray<number> = number16;
// ro16[0] = 12; // error!
// ro16.push(5); // error!
// ro16.length = 100; // error!
// number16 = ro16; // error!

number16.length = 100;
console.log(number16);
number16.length = 2;
console.log(number16);
