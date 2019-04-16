# Redion

Session with redis storage or local storage.

# Description

This is a koa session middleware with **redis / local storage** and **TypeScript** supported, use in [Rester](https://www.npmjs.com/package/@iinfinity/rester) server framework on NPM.

[See source code on GitHub](https://github.com/DevinDon/redion)

[See release package on NPM](https://www.npmjs.com/package/@iinfinity/redion)

# Change Log

[Full Change Log](https://github.com/DevinDon/redion/blob/master/docs/CHANGELOG.md)

## 0.4.4 => 0.4.5

- chore: update package

## 0.3.4 => 0.4.0

- feat: local storage support
- refactor: refactor redis storage support
- refactor: refactor class Redion

# Usage

## For Koa

```typescript
import { Option, Redion } from '@iinfinity/redion';
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
```

## For Rester

```typescript
import { Option, Redion } from '@iinfinity/redion';
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
```

## Option

[See the source code of the Session interface.](https://github.com/DevinDon/redion/blob/master/src/main/@types/index.ts)

```typescript
/** Session middleware option. */
export interface Option {
  /** Cookie domain. */
  domain: string;
  /** Expire time, second. */
  expire: number;
  /** File storage, for local only. */
  file?: string;
  /** Koa instance for signing cookie. */
  koa: Koa;
  /** Cookie name of session id. */
  name: string;
  /** Redis connection options. */
  redis?: RedisOptions;
  /** Signed your cookie with this array. */
  secert: string[];
}
```

# License

[Mail to IInfinity](mailto:I.INF@Outlook.com)

[THE MIT LICENSE](https://github.com/DevinDon/redion/blob/master/LICENSE)
