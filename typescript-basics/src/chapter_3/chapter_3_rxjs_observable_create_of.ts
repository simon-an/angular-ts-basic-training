import { of } from "rxjs";

function next(val: number) {
  console.log(`next: ${val}`);
}
function error() {
  console.log("error!");
}
function completed() {
  console.log("completed!");
}

of(1, 2, 3, 4).subscribe(next, error, completed);
