# RediSession

Session with redis.

# Description

This is a koa session middleware with **redis storage** and **TypeScript** supported, use in [KBS, Koa Backend Server](https://www.npmjs.com/package/koa-backend-server).

[Github](https://github.com/DevinDon/redisession)

[NPM](https://www.npmjs.com/package/redisession)

# Change Log

[Full Change Log](https://github.com/DevinDon/redisession/blob/master/dist/CHANGELOG.md)

## 0.2.3 => 0.2.6

- Fixed cookie expires time.

# Usage

## Quick start

**It is easy to understand, isn't it?**

```typescript
import Koa, { Middleware } from 'koa';
import { RediSession } from 'redisession';

const app = new Koa();
const session = new RediSession(app, { name: 'session.id' }).ware;

app.use(session);

app.listen(80);
```

## Session Options

[See the source code of the Session interface.](https://github.com/DevinDon/redisession/blob/master/src/type/index.ts)

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

# License

[MIT](./LICENSE)

# Author

[Devin Don(夜寒苏)](mailto:DevinDon@Foxmail.com)
