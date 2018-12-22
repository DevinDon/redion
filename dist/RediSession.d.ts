import Koa, { Middleware } from 'koa';
import { Options, Session } from './type';
export declare class RediSession {
    private koa;
    private sessionOptions;
    private redis;
    private getCookieOptions;
    private setCookieOptions;
    constructor(koa: Koa, sessionOptions?: Options);
    middleware(c: Koa.Context, next: () => Promise<any>): Promise<void>;
    add(session: Session): Promise<boolean>;
    delete(id: string): Promise<number>;
    disconnect(): void;
    generate(): string;
    refresh(id: string): Promise<boolean>;
    readonly ware: Middleware;
}
export default RediSession;
