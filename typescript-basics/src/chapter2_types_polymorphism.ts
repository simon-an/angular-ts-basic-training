interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
  tick(): void;
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(public h: number, public m: number) {}
  tick() {
    console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("tick tock");
  }
}
let digital: ClockInterface = createClock(DigitalClock, 12, 17);
digital.tick();
let analog: ClockInterface = createClock(AnalogClock, 7, 32);
analog.tick();
console.log(new DigitalClock(1, 20).m);
// console.log(new AnalogClock(1, 20).m);
