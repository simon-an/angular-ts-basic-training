function doSomeThing(value: number): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    // throw new Error('Something failed')
    setTimeout(() => {
      // Dont throw errors here.
      console.log("doSomeThing", value + 1);
      // reject(new Error('Something failed'));
      resolve(value + 1);
    }, 1000);
  });
}
function doSomeThingElse(value: number): Promise<number> {
  return new Promise(resolve =>
    setTimeout(() => {
      console.log("doSomeThingElse", value + 1);
      resolve(value + 1);
    }, 1000)
  );
}
function doThirdThing(value: number): Promise<number> {
  return new Promise(resolve =>
    setTimeout(() => {
      console.log("doThirdThing", value + 1);
      resolve(value + 1);
    }, 1000)
  );
}
function failureCallback(error: any): any {
  console.log("errorxyz:", error);
  return error;
}

// # Callback hell
// function gogogo() {
//   doSomeThing(function(result) {
//     doSomethingElse(
//       result,
//       function(newResult) {
//         doThirdThing(
//           newResult,
//           function(finalResult) {
//             console.log("Got the final result: " + finalResult);
//           },
//           failureCallback
//         );
//       },
//       failureCallback
//     );
//   }, failureCallback);
// }

// # Promise chain
function gogogo(value: number) {
  doSomeThing(value)
    .then(result => doSomeThingElse(result))
    .then(result => {
      console.log("dazwischen");
      return result;
    })
    .then(newResult => doThirdThing(newResult))
    .then(finalResult => console.log("Got the final result: " + finalResult))
    .catch(failureCallback)
    .finally(() => {
      console.log("This will be shown always!");
    });
}

// # Promise Chaining with Array.reduce
// type functionType<T> = (param: T) => Promise<T>;
// function gogogo(value: number) {
//   try {
//     const reducer = (
//       acc: Promise<number>,
//       val: functionType<number>
//     ): Promise<number> => acc.then(val);
//     const composeAsync = (...funcs: functionType<number>[]) => (
//       x: number
//     ): Promise<number> => funcs.reduce(reducer, Promise.resolve(x));

//     const iterate = composeAsync(
//       doSomeThing,
//       (result: number) => {
//         console.log("dazwischen");
//         return Promise.resolve(result);
//       },
//       doSomeThingElse,
//       doThirdThing
//     );
//     iterate(value).then((result: number) => {
//       console.log(`Got the final result: ${result}`);
//       return Promise.resolve(result);
//     });
//   } catch (error) {
//     failureCallback(error);
//   }
// }

// # async/await
// async function gogogo(value: number) {
//   try {
//     let result = value;
//     for (const f of [doSomeThing, doSomeThingElse, doThirdThing]) {
//       result = await f(result);
//     }
//     await console.log(`Got the final result: ${result}`);
//   } catch (error) {
//     failureCallback(error);
//   }
// }

// async function gogogo(value: number) {
//   try {
//     let result = await doSomeThing(value);
//     console.log("dazwischen");
//     result = await doSomeThingElse(result);
//     result = await doThirdThing(result);
//     await console.log(`Got the final result: ${result}`);
//   } catch (error) {
//     failureCallback(error);
//   }
// }

gogogo(1);
