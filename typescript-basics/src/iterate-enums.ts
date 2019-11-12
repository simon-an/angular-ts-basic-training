// export enum Suit {
//     Diamonds = "Diamonds",
//     Hearts = "Hearts",
//     Clubs = "Clubs",
//     Spades = "Spades",
// }
export enum Suit {
  Diamonds,
  Hearts,
  Clubs,
  Spades
}
console.log(JSON.stringify(Suit));
console.log(JSON.stringify(Object.keys(Suit)));

const keys = Object.keys(Suit);

console.log("===========================================");
for (let suit in keys) {
  console.log(suit);
}

console.log("===========================================");
for (let suit of keys) {
  console.log(suit);
}

console.log("===========================================");
for (let suit in Suit) {
  console.log(suit);
}
