import { RedisOptions } from 'ioredis';
import Koa from 'koa';

/** Session infomation. */
// export type Session = Map<string, any>;
export interface Session {
  [index: string]: any;
  id: string;
  /** Expire at this time, UTC millionseconds */
  __expireAt: number;
}

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

/** DBFile. */
export interface DBFile {
  keys: string[];
  values: Session[];
  size: number;
}
