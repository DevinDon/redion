import { GetOption, SetOption } from 'cookies';
import RedisInstance, { Redis } from 'ioredis';
import Koa, { Middleware } from 'koa';
import { Options, Session } from './type';

/** Session middleware class. */
export class RediSession {

  /** Redis connection. */
  private redis: Redis;
  /** Cookie options on get. */
  private getCookieOptions: GetOption;
  /** Cookie options on set. */
  private setCookieOptions: SetOption;

  /**
   * Config your own session pool.
   * @param koa Koa instance.
   * @param sessionOptions Session options.
   */
  constructor(
    private koa: Koa,
    private sessionOptions: Options = { name: 'session.id' }
  ) {
    // Set secert keys to encrypt cookies.
    koa.keys = sessionOptions.secert || ['default', 'secert', 'keys'];
    this.redis = new RedisInstance(sessionOptions.redis);
    this.getCookieOptions = { signed: true };
    this.setCookieOptions = {
      domain: sessionOptions.domain,
      httpOnly: sessionOptions.httpOnly,
      maxAge: sessionOptions.maxAge,
      signed: true
    };
  }

  /**
   * RediSession middleware.
   * @param c Context.
   * @param next Next.
   */
  public async session(c: Koa.Context, next: () => Promise<any>): Promise<void> {
    next();
    /** Session id. */
    let id = c.cookies.get(this.sessionOptions.name, this.getCookieOptions);
    if (id) { // has own session id
      if (await this.refresh(id)) { // refresh session max age
        c.cookies.set(this.sessionOptions.name, id, this.setCookieOptions);
      } else { // clear session id
        c.cookies.set(this.sessionOptions.name);
      }
    } else { // generate a new session id
      id = this.generate();
      if (await this.add({ id, time: Date.now() })) { // add new session id to cookie
        c.cookies.set(this.sessionOptions.name, id, this.setCookieOptions);
      } else { // clear session id
        c.cookies.set(this.sessionOptions.name);
      }
    }
  }

  /**
   * Add or update a new session to pool.
   * @param session Session info.
   */
  public async add(session: Session): Promise<boolean> {
    await this.redis.hmset(session.id, 'time', session.time);
    return this.refresh(session.id);
  }

  /**
   * Delete session by session id.
   * @param id Session id.
   */
  public async delete(id: string): Promise<number> {
    return await this.redis.del(id);
  }

  /** Destory this pool instance. */
  public disconnect() {
    this.redis.disconnect();
  }

  /**
   * Generate a new session id.
   * @returns New session id.
   */
  public generate(): string {
    return String(Date.now()) + String(Math.random()).slice(0, 5);
  }

  /**
   * Refresh exprise time, second.
   * @param id Session id.
   * @returns True of false.
   */
  public async refresh(id: string): Promise<boolean> {
    return Boolean(await this.redis.expire(id, this.sessionOptions.maxAge || 3600));
  }

  /**
   * Get this ware.
   */
  public get ware(): Middleware {
    return this.session.bind(this);
  }

}

export default RediSession;
