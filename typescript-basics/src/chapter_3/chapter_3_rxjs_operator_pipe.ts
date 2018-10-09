import { filter, map } from "rxjs/operators";
import { of } from "rxjs";

const nums = of(1, 2, 3, 4, 5);

const squareOdd = nums.pipe(
  filter(n => n % 2 !== 0),
  map(n => n * n)
);

// Subscribe to get values
squareOdd.subscribe(x => console.log(x));

// Logs
// 1
// 9
// 25
