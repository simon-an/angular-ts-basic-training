const numLivesForCat = 9;
const kitty = {
  name: 'Aurora',
  numLives: numLivesForCat
};

// Error
// kitty = {
//     name: "Danielle",
//     numLives: numLivesForCat
// };

// all "okay"
kitty.name = 'Rory';
kitty.name = 'Kitty';
kitty.name = 'Cat';
kitty.numLives--;

console.log(kitty);
