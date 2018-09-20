namespace map {
    const resultArray = [];
    const initialArray = [1, 2, 3, 4];
    for (let index = 0; index < initialArray.length; index++) {
        resultArray[index] = initialArray[index] * initialArray[index];
    }
    console.log(resultArray);


    const multiply = (value: number) => value * value;
    console.log([1, 2, 3, 4].map(multiply));
}