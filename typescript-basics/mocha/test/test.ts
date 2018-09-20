import { suite, test, slow, timeout } from "mocha-typescript";
import { assert } from "chai";
import { Unit } from "../src";

declare var console: any, setTimeout: any;

@suite class Hello {
    @test world() {
        const reducer = (sum: number, value: number) => sum += value;
        const result = [1, 2, 3, 4].reduce(reducer, 0);
        assert.equal(result, 10, "Expected result to equal 10.");
    }
}

function doWork(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000));
}
before("start server", async () => {
    // Run express?
    console.log("start server");
    await doWork();
    console.log("server started");
});
after("kill server", async () => {
    // Kill the server.
    console.log("kill server");
    await doWork();
    console.log("server killed");
});

describe("vanilla bdd", () => {
    it("test", async () => {
        await console.log("  vanilla bdd test");
    });
});

suite("vanilla tdd", () => {
    test("test", async () => {
        await console.log("  vanilla tdd test");
    });
});

@suite class UnitTest extends Unit {
    @test "big is true with big number"() {
        console.log("  UnitTest big is true with big number");
        assert(this.big(200));
    }
    @test "big is false with small number"() {
        console.log("  UnitTest big is false with small number");
        assert(!this.big(50));
    }
}

suite("nested class suite", () => {
    @suite class NestedTest {
        @test "a test"() {
            console.log("  nested class suite NestedTest a test");
        }
    }
});