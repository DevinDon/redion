import Koa, { Middleware } from 'koa';
import { Options, Session } from './type';
/** Session middleware class. */
export declare class RediSession {
    private sessionOptions;
    /** Redis connection. */
    private redis;
    /** Cookie options on get. */
    private getCookieOptions;
    /** Cookie options on set. */
    private setCookieOptions;
    /**
     * Config your own session pool.
     * @param {Koa} koa Koa instance.
     * @param {Options} sessionOptions Session options.
     */
    constructor(koa: Koa, sessionOptions?: Options);
    /**
     * RediSession middleware.
     * @param {Koa.Context} c Context.
     * @param {Promise<any>} next Next.
     * @returns {Promise<void>} void.
     */
    session(c: Koa.Context, next: () => Promise<any>): Promise<void>;
    /**
     * Add or update a new session to pool.
     * @param {Session} session Session info.
     * @returns {Promise<boolean>} Successed refresh or not.
     */
    add(session: Session): Promise<boolean>;
    /**
     * Delete session by session id.
     * @param {string} id Session id.
     * @returns {number} Delete count.
     */
    delete(id: string): Promise<number>;
    /**
     * Destory this pool instance.
     * @returns {void} void.
     */
    disconnect(): void;
    /**
     * Generate a new session id with time.
     * @returns {string} New session id.
     */
    generate(): string;
    /**
     * Get session object.
     * @param {string} id Session id.
     * @returns {Promise<Session>} Session object. If no such session, return empty id.
     */
    get(id: string): Promise<Session>;
    /**
     * Refresh exprise time, second.
     * @param {string} id Session id.
     * @returns {boolean} Set exprise successed or not.
     */
    refresh(id: string): Promise<boolean>;
    /**
     * @returns {Middleware} Return this ware.
     */
    readonly ware: Middleware;
}
export default RediSession;
