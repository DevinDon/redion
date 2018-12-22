import { Middleware } from 'koa';
import { Session } from '../src';

const a: Middleware = async (c, next) => {
  // c.session.id
};

// class A {
//   private t = 1;
//   test() {
//     console.log(this.t);
//   }
// }

// class B {
//   private t = 2;
// }

// const a = new A();
// const b = new B();

// a.test.bind(b)();
