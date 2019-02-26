import { fromEvent, Observable } from 'rxjs';

const el = document.getElementById('my-element');

// Create an Observable that will publish mouse movements
let mouseMoves;
if (el) {
  mouseMoves = fromEvent<MouseEvent>(el, 'mousemove');
}

// Subscribe to start listening for mouse-move events
if (mouseMoves) {
  const subscription = mouseMoves.subscribe((evt: MouseEvent) => {
    // Log coords of mouse movements
    console.log(`Coords: ${evt.clientX} X ${evt.clientY}`);

    // When the mouse is over the upper-left of the screen,
    // unsubscribe to stop listening for mouse movements
    if (evt.clientX < 40 && evt.clientY < 40) {
      subscription.unsubscribe();
    }
  });
}
