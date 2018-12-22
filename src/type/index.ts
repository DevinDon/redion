import { RedisOptions } from 'ioredis';

/** Session infomation. */
export interface Session {
  id: string;
  [index: string]: any;
}

/** Session middleware options. */
export interface Options {
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
