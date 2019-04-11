// import { Option, Redion } from '@iinfinity/redion';
import { Option, Redion } from '../main'; // use above import statement in your workspace
import Koa from 'koa'; // import koa

const koa = new Koa(/** ... */);

const option: Option = {
  domain: 'your.domain.com',
  expire: 1000, // second
  koa, // your koa instance, for signing cookie
  name: 'session.id', // cookie key of session id
  secert: ['your', 'secert', 'keys'] // signed your cookie with this array
};

koa.use(new Redion(option).ware);
