"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.setCookieOptions = { domain: sessionOptions.domain, httpOnly: sessionOptions.httpOnly, maxAge: sessionOptions.maxAge, signed: true };
    }
    middleware(c, next) {
        return __awaiter(this, void 0, void 0, function* () {
            next();
            let id = c.cookies.get(this.sessionOptions.name, this.getCookieOptions);
            if (id) {
                if (yield this.refresh(id)) {
                    c.cookies.set(this.sessionOptions.name, id, this.setCookieOptions);
                }
                else {
                    c.cookies.set(this.sessionOptions.name);
                }
            }
            else {
                id = this.generate();
                if (yield this.add({ id, time: Date.now() })) {
                    c.cookies.set(this.sessionOptions.name, id, this.setCookieOptions);
                }
                else {
                    c.cookies.set(this.sessionOptions.name);
                }
            }
        });
    }
    add(session) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.hmset(session.id, 'time', session.time);
            return this.refresh(session.id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redis.del(id);
        });
    }
    disconnect() {
        this.redis.disconnect();
    }
    generate() {
        return String(Date.now()) + String(Math.random()).slice(0, 5);
    }
    refresh(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield this.redis.expire(id, this.sessionOptions.maxAge || 3600));
        });
    }
    get ware() {
        return this.middleware;
    }
}
exports.RediSession = RediSession;
exports.default = RediSession;
