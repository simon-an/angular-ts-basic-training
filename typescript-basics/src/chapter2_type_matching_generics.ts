interface Empty<T> {}
let xx: Empty<number>;
let yy: Empty<string> = {};

xx = yy; // OK, because y matches structure of x

interface NotEmpty<T> {
  data: T;
}
let x1: NotEmpty<number> = { data: 1 };
let y1: NotEmpty<string> = { data: '' };

// x1 = y1; // Error, because x and y are not compatibledata: ''
