import { of, concat } from "rxjs";

//emits 1,2,3
const sourceOne = of(1, 2, 3);
//emits 4,5,6
const sourceTwo = of(4, 5, 6);

//used as static
const example = concat(sourceOne, sourceTwo);
//output: 1,2,3,4,5,6
example.subscribe(val => console.log(val));
