interface BLA {
    text: string;

}

const x: BLA = {
    text: 'world'
}
console.log('hello', x.text);


declare function create(o: object | null): void;


declare function create(o: {} | null): void;

declare function bla(x: Boolean): void;

let someValue: unknown = "this is a string";

if (typeof someValue === 'string') {
    let strLength: number = (<string>someValue).length;
}