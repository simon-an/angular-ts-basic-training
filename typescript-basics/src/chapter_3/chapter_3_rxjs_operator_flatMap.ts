// execute ts-node chapter_3/chapter_3_rxjs_operator_flatMap.ts
import { of, interval } from "rxjs";
import { flatMap, map } from "rxjs/operators";

const letters = of("a", "b", "c");
const result = letters
    .pipe(
        flatMap(
            x => interval(1000)
            .pipe(
                map(i => `${x}${i}`)
            )
        )
    );
result.subscribe(x => console.log(x));

// Results in the following:
// a0
// b0
// c0
// *calculating*
// a1
// b1
// c1
// *calculating*
// a2
// b2
// c2
// continues to list a,b,c with respective ascending integers
