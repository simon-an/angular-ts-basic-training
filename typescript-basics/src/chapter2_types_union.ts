interface ISquare {
  kind: 'square';
  size: number;
}
interface IRectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}
interface ICircle {
  kind: 'circle';
  radius: number;
}

type Shape = ISquare | IRectangle | ICircle; // union type

function area(s: Shape) {
  switch (s.kind) {
    case 'square':
      return s.size * s.size;
    case 'rectangle':
      return s.height * s.width;
    case 'circle':
      return Math.PI * s.radius ** 2;
  }
}
console.log(area({ kind: 'square', size: 5 }));
console.log(area({ kind: 'rectangle', width: 1, height: 5 }));
