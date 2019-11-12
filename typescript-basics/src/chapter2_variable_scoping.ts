// var has function scope
var scoopingfoo = 123;
function test222() {
  var scoopingfoo = 456;
  console.log("inside test", scoopingfoo); // 456
}
test222();
console.log("outside test", scoopingfoo); // 123

function showVarFunctionScope() {
  var foo = 123;
  if (true) {
    var foo = 456;
  }
  console.log(foo); // 456
}
showVarFunctionScope();

function showLetBlockScope() {
  let foo = 123;
  if (true) {
    let foo = 456;
  }
  console.log(foo); // 123
}
showLetBlockScope();

// // Example reuse variable names in switch statement with let because of {} in case bodies
switch (name) {
  case "x": {
    let x = 5;
    // ...
    break;
  }
  case "y": {
    let x = 10;
    // ...
    break;
  }
}
