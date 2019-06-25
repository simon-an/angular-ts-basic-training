interface IBird {
  fly(): void;
  layEggs(): void;
}

interface IFish {
  swim(): void;
  layEggs(): void;
}

function getSmallPet(): IFish | IBird {
  if (Math.random() * 10 > 5) {
    return {
      fly: () => {
        console.log('flying');
      },
      layEggs: () => {
        console.log('lay eggs');
      }
    } as IBird;
  } else {
    return {
      swim: () => {
        console.log('swimming');
      },
      layEggs: () => {
        console.log('lay eggs');
      }
    } as IFish;
  }
}

let pet: IFish | IBird = getSmallPet();
pet.layEggs(); // okay
// pet.swim(); // errors
// pet.fly(); // errors

function isFish(pet: IFish | IBird): pet is IFish {
  return (pet as IFish).swim !== undefined;
}

// if(pet){
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}

console.log('isFish', isFish(pet));
