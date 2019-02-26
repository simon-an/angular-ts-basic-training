let list28 = [4, 5, 6];

for (let i in list28) {
  console.log(i); // "0", "1", "2",
}

for (let i of list28) {
  console.log(i); // "4", "5", "6"
}

let pets = new Set(['Cat', 'Dog', 'Hamster']);
(pets as any)['species'] = 'mammals';

for (let pet in pets) {
  console.log(pet); // "species"
}

for (let pet of pets) {
  console.log(pet); // "Cat", "Dog", "Hamster"
}
