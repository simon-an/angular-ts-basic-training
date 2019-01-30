namespace unkown {
  let someValue: unknown = 999;

  // Object is of type 'unknown'.
  // const len = someValue.length;

  let strLength: number = (<string>someValue).length;
  console.log(strLength);

  strLength = (<string>someValue).length;
  console.log(strLength);

  if (typeof someValue === "string") {
    let strLength: number = (<string>someValue).length;
    console.log(strLength);
  } else {
    console.log("wrong type");
  }
}
