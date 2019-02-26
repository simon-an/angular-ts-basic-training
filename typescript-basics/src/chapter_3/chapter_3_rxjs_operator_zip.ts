import { of, zip } from 'rxjs';
import { delay } from 'rxjs/operators';

const sourceOne = of('Hello');
const sourceTwo = of('World!');
const sourceThree = of('Goodbye');
const sourceFour = of('World!');
// wait until all observables have emitted a value then emit all as an array
const example = zip(
  sourceOne,
  sourceTwo.pipe(delay(100)),
  sourceThree.pipe(delay(200)),
  sourceFour.pipe(delay(300)),
);
// output: ["Hello", "World!", "Goodbye", "World!"]
const subscribe = example.subscribe(val => console.log(val));
