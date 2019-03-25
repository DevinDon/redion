"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("@iinfinity/logger");
/** Session middleware class. */
class Redion {
    /**
     * Config your own session pool.
     *
     * @param {Koa} koa Koa instance.
     * @param {Options} options Session options.
     */
    constructor(koa, options = { domain: 'localhost' }) {
        this.koa = koa;
        this.options = options;
        this.options = Object.assign({
            domain: 'localhost',
            httpOnly: true,
            maxAge: 24 * 3600 * 1000,
            name: 'session.id',
            overwrite: true,
            redis: {
                retryStrategy: (times) => 10000
            },
            secert: ['default', 'secert', 'keys']
        }, options);
        this.options.redis = Object.assign({ retryStrategy: (times) => 10000 }, this.options.redis);
        this.init();
    }
    /**
     * Init RediSession.
     */
    async init() {
        this.getCookieOptions = { signed: true };
        this.setCookieOptions = {
            domain: this.options.domain,
            httpOnly: this.options.httpOnly,
            maxAge: this.options.maxAge * 1000,
            signed: true,
            overwrite: this.options.overwrite
        };
        this.koa.keys = this.options.secert;
        this.redis = new ioredis_1.default(this.options.redis);
        this.redis.on('error', err => {
            logger_1.logger.error(`Connection failed, retry in 10 seconds. ${err}`);
        });
    }
    /**
     * RediSession middleware.
     *
     * @param {ParameterizedContext} c Context.
     * @param {Promise<any>} next Next.
     * @returns {Promise<void>} void.
     */
    async session(c, next) {
        /** Session id. */
        let id = c.cookies.get(this.options.name, this.getCookieOptions);
        // let address = c.
        if ((id && await this.refresh(id)) || await this.add({ id: id = this.generate() })) {
            // Client has own session id and refresh session max age successfully,
            // or generate a new session successfully.
            c.cookies.set(this.options.name, id, this.setCookieOptions);
            c.session = await this.get(id);
        }
        else { // If both failed, clear session id. Maybe redis server is down.
            c.cookies.set(this.options.name, undefined, { maxAge: 0 });
            c.session = { id: '' };
        }
        await next();
        // Update session object in redis.
        await this.add(c.session);
    }
    /**
     * Add or update a new session to pool.
     *
     * @param {Session} session Session info.
     * @returns {Promise<boolean>} Successed refresh or not.
     */
    async add(session) {
        await this.redis.hmset(session.id, 'session', JSON.stringify(session));
        return this.refresh(session.id);
    }
    /**
     * Delete session by session id.
     *
     * @param {string} id Session id.
     * @returns {number} Delete count.
     */
    async delete(id) {
        return await this.redis.del(id);
    }
    /**
     * Destory this pool instance.
     *
     * @returns {void} void.
     */
    disconnect() {
        this.redis.disconnect();
    }
    /**
     * Generate a new session id with time.
     *
     * @returns {string} New session id.
     */
    generate() {
        return String(Date.now()) + String(Math.random()).slice(2, 7);
    }
    /**
     * Get session object.
     *
     * @param {string} id Session id.
     * @returns {Promise<Session>} Session object. If no such session, return empty id.
     */
    async get(id) {
        try {
            return JSON.parse((await this.redis.hget(id, 'session')));
        }
        catch (err) {
            return { id: '' };
        }
    }
    /**
     * Refresh exprise time, second.
     *
     * @param {string} id Session id.
     * @returns {boolean} Set exprise successed or not.
     */
    async refresh(id) {
        return Boolean(await this.redis.expire(id, this.options.maxAge || 3600));
    }
    /**
     * @returns {Middleware} Return this ware.
     */
    get ware() {
        return this.session.bind(this);
    }
}
exports.Redion = Redion;
exports.default = Redion;