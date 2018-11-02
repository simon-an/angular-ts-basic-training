// let deck = {
//   suits: ['hearts', 'spades', 'clubs', 'diamonds'],
//   cards: Array(52),
//   createCardPicker: function() {
//     return function() {
//       let pickedCard = Math.floor(Math.random() * 52);
//       let pickedSuit = Math.floor(pickedCard / 13);

//       return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
//     };
//   }
// };

// let cardPicker = deck.createCardPicker();
// let pickedCard = cardPicker();

// alert('card: ' + pickedCard.card + ' of ' + pickedCard.suit);

// Notice that createCardPicker is a function that itself returns a function. If we tried to run the example, we would get an error instead of the expected alert box. This is because the this being used in the function created by createCardPicker will be set to window instead of our deck object. That’s because we call cardPicker() on its own. A top-level non-method syntax call like this will use window for this. (Note: under strict mode, this will be undefined rather than window).
// #We can fix this by making sure the function is bound to the correct this before we return the function to be used later. This way, regardless of how it’s later used, it will still be able to see the original deck object. To do this, we change the function expression to use the ECMAScript 6 arrow syntax. Arrow functions capture the this where the function is created rather than where it is invoked:
let deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function() {
    // NOTE: the line below is now an arrow function, allowing us to capture 'this' right here
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  }
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();
console.log("card: " + pickedCard.card + " of " + pickedCard.suit);
let pickedCard2 = cardPicker();
console.log("card: " + pickedCard2.card + " of " + pickedCard2.suit);
let pickedCard3 = cardPicker();
console.log("card: " + pickedCard3.card + " of " + pickedCard3.suit);
