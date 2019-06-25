import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, reduce, take, toArray } from 'rxjs/operators';

// Exercise 1

const source1 = of(1, 4, 6, 9, 11, 15, 17);

const example1 = source1.pipe(
  filter(num => num > 10),
  toArray()
);
example1.subscribe(result => console.log(`Result1: ${result}`));

// Exerciese 2

const source2 = from([1, 2, 3, 4, 5, 6, 7, 8]);

const example2 = source2.pipe(
  filter(num => num % 2 === 0),
  take(3),
  map((num: number) => num * num),
  reduce((acc, val) => acc + val)
);

example2.subscribe(result => console.log(`Result2: ${result}`));

// Exercise 3

const arrayOfWords: string[] = ['burrito', 'salsa', 'avocado'];
const complicatedArray: any[] = ['salsa', 44, true];

const makeAllCaps = (item: Observable<any>): Observable<string> => {
  return item.pipe(
    map((item: any) => {
      if (typeof item !== 'string') {
        throw Error('Not all items in the array are strings!');
      } else {
        return item.toUpperCase();
      }
    })
  );
};

from(arrayOfWords)
  .pipe(
    makeAllCaps,
    toArray(),
    map(array => array.sort()),
    catchError(error => of(error))
  )
  .subscribe(result => console.log(`Result3a: ${result}`));

of(complicatedArray)
  .pipe(
    makeAllCaps,
    toArray(),
    map(array => array.sort()),
    catchError(error => of(error))
  )
  .subscribe(result => console.log(`Result3b: ${result}`));
