function sumMatrix(matrix: number[][]) {
  var sum = 0;
  for (var i = 0; i < matrix.length; i++) {
    var currentRow = matrix[i];
    for (var i = 0; i < currentRow.length; i++) {
      sum += currentRow[i];
    }
  }

  return sum;
}
console.log(sumMatrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
function sumMatrix2(matrix: number[][]) {
  var sum = 0;
  for (var i = 0; i < matrix.length; i++) {
    var currentRow = matrix[i];
    for (var j = 0; j < currentRow.length; j++) {
      sum += currentRow[j];
    }
  }

  return sum;
}
console.log(sumMatrix2([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
