import Koa, { Middleware, ParameterizedContext } from 'koa';
import { Options, Session } from '../@types';
/** Session middleware class. */
export declare class Redion {
    private koa;
    private options;
    /** Redis connection. */
    private redis;
    /** Cookie options on get. */
    private getCookieOptions;
    /** Cookie options on set. */
    private setCookieOptions;
    /** Remaining retries, default is 5. */
    private retries;
    /** Retry interval, second. */
    private retryInterval;
    /**
     * Config your own session pool.
     *
     * @param {Koa} koa Koa instance.
     * @param {Options} options Session options.
     */
    constructor(koa: Koa, options?: Options);
    /**
     * Init RediSession.
     */
    private init;
    /**
     * RediSession middleware.
     *
     * @param {ParameterizedContext} c Context.
     * @param {Promise<any>} next Next.
     * @returns {Promise<void>} void.
     */
    session(c: ParameterizedContext, next: () => Promise<any>): Promise<void>;
    /**
     * Add or update a new session to pool.
     *
     * @param {Session} session Session info.
     * @returns {Promise<boolean>} Successed refresh or not.
     */
    add(session: Session): Promise<boolean>;
    /**
     * Delete session by session id.
     *
     * @param {string} id Session id.
     * @returns {number} Delete count.
     */
    delete(id: string): Promise<number>;
    /**
     * Destory this pool instance.
     *
     * @returns {void} void.
     */
    disconnect(): void;
    /**
     * Generate a new session id with time.
     *
     * @returns {string} New session id.
     */
    generate(): string;
    /**
     * Get session object.
     *
     * @param {string} id Session id.
     * @returns {Promise<Session>} Session object. If no such session, return empty id.
     */
    get(id: string): Promise<Session>;
    /**
     * Refresh exprise time, second.
     *
     * @param {string} id Session id.
     * @returns {boolean} Set exprise successed or not.
     */
    refresh(id: string): Promise<boolean>;
    /**
     * @returns {Middleware} Return this ware.
     */
    readonly ware: Middleware;
}
export default Redion;
