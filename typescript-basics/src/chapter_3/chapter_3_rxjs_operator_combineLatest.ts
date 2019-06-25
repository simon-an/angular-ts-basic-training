import { of } from 'rxjs';
import { combineLatest } from 'rxjs/operators';

const weight = of(70, 72, 76, 79, 75);
const height = of(1.7, 1.8, 2);
const bmiFromWeight = weight.pipe(
    combineLatest(height, (w: number, h: number) => {
        console.log(`height=${h}`);
        console.log(`weihgt=${w}`);
      return w / (h * h);
    })
  );
const bmiFromHeight = height.pipe(
  combineLatest(weight, (h: number, w: number) => {
      console.log(`height=${h}`);
      console.log(`weihgt=${w}`);
    return w / (h * h);
  })
);
bmiFromWeight.subscribe((x: number) => console.log('From Weight: BMI is ' + x));
bmiFromHeight.subscribe((x: number) => console.log('From Height: BMI is ' + x));
