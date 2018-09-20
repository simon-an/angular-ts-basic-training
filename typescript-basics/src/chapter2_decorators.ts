namespace decorators {
  function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      newProperty = "new property";
      hello = "override";
    }
  }

  @classDecorator
  class Greeter {
    property = "property";
    hello: string;
    constructor(m: string) {
      this.hello = m;
    }
  }

  console.log(new Greeter("world"));

  function f() {
    console.log("f(): evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.writable = false;
      console.log("f(): called", target, propertyKey, descriptor);
    }
  }

  function g() {
    console.log("g(): evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("g(): called", target, propertyKey, descriptor);
    }
  }

  class C {
    @f()
    @g()
    method(param: string) {
      console.log('called:', param);
    }
  }

  new C().method('x');

}