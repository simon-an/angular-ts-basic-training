function nullcheck1(param: { property: string }): boolean {
  if (param !== null && param !== undefined) {
    if (param.property !== null && param.property !== undefined) {
      return true;
    }
  }
  return false;
}
function nullcheck2(param: { property: string }): boolean | string {
  return param && param.property;
}
function nullcheck3(param: { property: string }): boolean {
  return !!(param && param.property);
}

const obj: { property: string } = { property: "Hello World" };
console.log(nullcheck1(obj)); // true
console.log(nullcheck2(obj)); // Hello World
console.log(nullcheck3(obj)); // true
console.log(nullcheck1({ property: null } as any)); // false
console.log(nullcheck2({ property: null } as any)); // null
console.log(nullcheck3({ property: null } as any)); // false
