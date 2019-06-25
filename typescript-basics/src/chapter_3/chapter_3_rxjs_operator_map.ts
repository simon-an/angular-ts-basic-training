import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3)
  .pipe(map((val: number) => val * val))
  .subscribe(x => console.log(x));

// Logs
// 1
// 4
// 9
