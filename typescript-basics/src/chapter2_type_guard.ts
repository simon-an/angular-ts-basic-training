/* */
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function getSmallPet(): Fish | Bird {
  if (Math.random() * 10 > 5) {
    return {
      fly: () => {
        console.log("flying");
      },
      layEggs: () => {
        console.log("lay eggs");
      }
    } as Bird;
  } else {
    return {
      swim: () => {
        console.log("swimming");
      },
      layEggs: () => {
        console.log("lay eggs");
      }
    } as Fish;
  }
}

let pet = getSmallPet();
pet.layEggs(); // okay
// pet.swim(); // errors
// pet.fly(); // errors

function isFish(pet: Fish | Bird): pet is Fish {
  return (<Fish>pet).swim !== undefined;
}

// if(pet){
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}

console.log(isFish(getSmallPet()));
