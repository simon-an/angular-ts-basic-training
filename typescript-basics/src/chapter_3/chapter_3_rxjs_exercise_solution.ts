import { filter, map, reduce, tap, take } from "rxjs/operators";
import { from } from "rxjs";

const source = from([1, 2, 3, 4, 5, 6, 7, 8]);

const example = source.pipe(
  filter(num => num % 2 === 0),
  take(3),
  map((num: number) => num * num),
  reduce((acc, val) => acc + val)
);

example.subscribe(result => console.log(result));
