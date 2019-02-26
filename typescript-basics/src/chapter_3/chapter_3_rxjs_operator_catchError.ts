import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';

// Return "response" from the API. If an error happens,
// return an empty array.
const apiData = ajax('/api/data').pipe(
  map(res => {
    if (!res.response) {
      throw new Error('Value expected!');
    }
    return res.response;
  }),
  catchError(err => of([]))
);

apiData.subscribe({
  next(x) {
    console.log('data: ', x);
  },
  error(err) {
    console.log('errors already caught... will not run');
  }
});

// output: "data: []""
// if catchError(err => of([])) is commented out -> output: "errors already caught... will not run"
