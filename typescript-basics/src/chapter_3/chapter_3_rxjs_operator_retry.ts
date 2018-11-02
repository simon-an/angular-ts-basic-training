// execute ts-node chapter_3/chapter_3_rxjs_operator_retry.ts
import { interval, of, throwError } from "rxjs";
import { mergeMap, retry } from "rxjs/operators";

//emit value every 1s
const source = interval(1000);
const example = source.pipe(
  mergeMap(val => {
    //throw error for demonstration
    if (val > 3) {
      return throwError("Error!");
    }
    return of(val);
  }),
  //retry 2 times on error
  retry(2)
);

example.subscribe({
  next: val => console.log(val),
  error: val => console.log(`${val}: Retried 2 times then quit!`)
});

/*
  output:
  0..1..2..3..
  0..1..2..3..
  0..1..2..3..
  "Error!: Retried 2 times then quit!"
*/
