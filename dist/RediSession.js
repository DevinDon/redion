"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
class RediSession {
    constructor(koa, sessionOptions = { name: 'session.id' }) {
        this.koa = koa;
        this.sessionOptions = sessionOptions;
        koa.keys = sessionOptions.secert || ['default', 'secert', 'keys'];
        this.redis = new ioredis_1.default(sessionOptions.redis);
        this.getCookieOptions = { signed: true };
        this.setCookieOptions = {
            domain: sessionOptions.domain,
            httpOnly: sessionOptions.httpOnly,
            maxAge: sessionOptions.maxAge,
            signed: true
        };
    }
    async session(c, next) {
        let id = c.cookies.get(this.sessionOptions.name, this.getCookieOptions);
        const time = Date.now();
        if ((id && await this.refresh(id))) {
            c.cookies.set(this.sessionOptions.name, id, this.setCookieOptions);
        }
        else if (await this.add({ id: id = this.generate(), time })) {
            c.cookies.set(this.sessionOptions.name, id, this.setCookieOptions);
            c.session = { id, time };
        }
        else {
            c.cookies.set(this.sessionOptions.name);
            c.session = { id: '', time: 0 };
        }
        await next();
    }
    async add(session) {
        await this.redis.hmset(session.id, 'time', session.time);
        return this.refresh(session.id);
    }
    async delete(id) {
        return await this.redis.del(id);
    }
    disconnect() {
        this.redis.disconnect();
    }
    generate() {
        return String(Date.now()) + String(Math.random()).slice(0, 5);
    }
    async refresh(id) {
        return Boolean(await this.redis.expire(id, this.sessionOptions.maxAge || 3600));
    }
    get ware() {
        return this.session.bind(this);
    }
}
exports.RediSession = RediSession;
exports.default = RediSession;
