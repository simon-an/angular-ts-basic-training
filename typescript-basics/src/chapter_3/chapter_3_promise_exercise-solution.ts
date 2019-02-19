//Exercise 1:
//Write a function testNum that takes a number as an argument and returns a Promise that tests if the value is less than or greater than the value 10.

const compareToTen = (num: number) => {
  return new Promise((resolve, reject) => {
    if (num > 10) {
      resolve(num + ' is greater than 10, success!');
    } else {
      reject(num + ' is less than 10, error!');
    }
  });
};

compareToTen(15)
  .then(result => console.log(result))
  .catch(error => console.log(error));

compareToTen(8)
  .then(result => console.log(result))
  .catch(error => console.log(error));

//Exercise 2:
//Write two functions that use Promises that you can chain! The first function, makeAllCaps(), will take in an array of words and capitalize them, and then the second function, sortWords(), will sort the words in alphabetical order. If the array contains anything but strings, it should throw an error.

const arrayOfWords: string[] = ['burrito', 'salsa', 'avocado'];
const complicatedArray: any[] = ['salsa', 44, true];

const makeAllCaps = (array: any[]): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    let capsArray: string[] = array.map((item: any) => {
      if (typeof item !== 'string') {
        reject('Error: Not all items in the array are strings!');
      }
      return item.toUpperCase();
    });
    resolve(capsArray);
  });
};

const sortWords = (array: string[]): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    if (array) {
      array.forEach(el => {
        if (typeof el !== 'string') {
          reject('Error: Not all items in the array are strings!');
        }
      });
    } else {
      reject('Error: Something went wrong with sorting words.');
    }
    resolve(array.sort());
  });
};

makeAllCaps(arrayOfWords)
  .then(sortWords)
  .then((result: string[]) => console.log(result))
  .catch((error: any) => console.log(error));

makeAllCaps(complicatedArray)
  .then(sortWords)
  .then((result: string[]) => console.log(result))
  .catch((error: any) => console.log(error));
