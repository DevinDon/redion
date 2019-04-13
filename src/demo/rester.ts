// import { Option, Redion } from '@iinfinity/redion';
import { Option, Redion } from '../main'; // use above import statement in your workspace
import Rester from '@iinfinity/rester'; // import rester

const rester = new Rester(/** ... */);

const option: Option = {
  domain: 'your.domain.com',
  expire: 1000, // second
  koa: rester.app, // your koa instance, for signing cookie
  name: 'session.id', // cookie key of session id
  secert: ['your', 'secert', 'keys'] // signed your cookie with this array
};

rester.use({
  'redis session middleware': new Redion(option).ware
});
