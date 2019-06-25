function createValue(): null | { value: number } {
  const num = Math.random() * 10;
  if (num > 8) {
    return {
      value: num
    };
  } else {
    return null;
  }
}

function checkNull(obj: any): boolean {
  if (obj) {
    return true;
  }
  return false;
}

while (true) {
  const strictNull: null | { value: number } = createValue();
  console.log(strictNull);
  if (strictNull!.value) {
    // if (checkNull(strictNull) && strictNull!.value) {
    // if (strictNull.value) {
    process.exit(strictNull!.value);
    // process.exit(strictNull.value);
  }
}
