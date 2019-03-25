# Redion

Session with redis.

# Description

This is a koa session middleware with **redis storage** and **TypeScript** supported, use in [KBS, Koa Backend Server](https://www.npmjs.com/package/koa-backend-server).

[Github](https://github.com/DevinDon/redion)

[NPM](https://www.npmjs.com/package/redion)

# Change Log

[Full Change Log](https://github.com/DevinDon/redion/blob/master/dist/CHANGELOG.md)

## 0.3.0 => 0.3.1

- fix: fix redis config assign

## 0.2.7 => 0.3.0

- feat: catch connection exception
- refactor: refactor source

# Usage

## Quick start

**It is easy to understand, isn't it?**

```typescript
import Koa, { Middleware } from 'koa';
import { Redion } from 'redion';

const app = new Koa();
const session = new Redion(app, { name: 'session.id' }).ware;

app.use(session);

app.listen(80);
```

## Session Options

[See the source code of the Session interface.](https://github.com/DevinDon/redion/blob/master/src/type/index.ts)

```typescript
/** Session middleware options. */
interface Options {
  /** Expire time, second. */
  maxAge?: number;
  /** Domain. */
  domain?: string;
  /** Http Only. */
  httpOnly?: boolean;
  /** Name of session id. */
  name: string;
  /** Can be overwrite. */
  overwrite?: boolean;
  /** Redis connection options. */
  redis?: RedisOptions;
  /** Secert keys. */
  secert?: string[];
}
```

# Author

[IInfinity](mailto:I.INF@Outlook.com)

# License

[THE MIT LICENSE](LICENSE)
