import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

const modulo3 = filter((val: number) => val % 3 === 0);

of(1, 2, 3, 4, 5, 6, 7, 8, 9)
  .pipe(modulo3)
  .subscribe(x => console.log(x));

// Logs
// 3
// 6
// 9
