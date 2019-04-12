import Logger from '@iinfinity/logger';
import { Middleware } from 'koa';
import { Option, Session } from './@types';
import { Local, Redis, Storage } from './Storage';

export * from './@types';
export * from './Storage';

declare module 'koa' {
  interface Context {
    session: Session;
  }
}

export const logger = new Logger({
  name: 'redion'
});

export class Redion {

  /** Serial number. */
  private serial: number;
  /** Storage, local or redis. */
  private storage: Storage;

  constructor(
    private option: Option
  ) {
    this.serial = 0;
    this.option.koa.keys = this.option.secert;
    this.storage = option.redis ? new Redis(option) : new Local(option);
  }

  /** Session middleware. */
  private session: Middleware = async (c, next) => {
    let id = c.cookies.get(this.option.name, { signed: true });
    if ((id && await this.storage.refresh(id)) || await this.storage.set({ id: id = this.generate() })) {
      c.cookies.set(this.option.name, id, { domain: this.option.domain, httpOnly: true, maxAge: this.option.expire * 1000, signed: true, overwrite: true });
      c.session = await this.storage.get(id);
    } else {
      c.cookies.set(this.option.name, undefined, { maxAge: 0 });
      c.session = { id: '' };
    }
    await next();
    this.storage.set(c.session);
  }

  /**
   * Generate a new session id by time.
   *
   * @returns {string} New session id.
   */
  private generate(): string {
    return `${Date.now()}-${++this.serial}`;
  }

  /**
   * @returns {Middleware} Return session middleware.
   */
  public get ware(): Middleware {
    return this.session.bind(this);
  }

}

export default Redion;
