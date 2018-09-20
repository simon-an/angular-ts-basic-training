import { suite, test, slow, timeout } from "mocha-typescript";
@suite class Hello {
    @test world() {
        // assert.equal(1, 2, "Expected one to equal two.");
        const reducer = (sum: number, value: number) => sum += value;
        console.log([1, 2, 3, 4].reduce(reducer, 0));
    }
}