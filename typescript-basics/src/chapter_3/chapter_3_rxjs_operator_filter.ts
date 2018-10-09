import { filter } from "rxjs/operators";
import { of } from "rxjs";

const nums = of(1, 2, 3, 4, 5, 6, 7, 8, 9);

const modulo3 = filter((val: number) => val % 3 === 0);
const squaredNums = modulo3(nums);

squaredNums.subscribe(x => console.log(x));

// Logs
// 3
// 6
// 9
