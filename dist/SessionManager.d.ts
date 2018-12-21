/// <reference types="koa-compose" />
import Koa, { Middleware } from 'koa';
import { Options, Session } from './type';
export declare class SessionManager {
    private koa;
    private sessionOptions;
    private redis;
    private getCookieOptions;
    private setCookieOptions;
    constructor(koa: Koa, sessionOptions?: Options);
    readonly middleware: Middleware;
    add(session: Session): Promise<boolean>;
    delete(id: string): Promise<number>;
    disconnect(): void;
    generate(): string;
    refresh(id: string): Promise<boolean>;
    readonly ware: import("koa-compose").Middleware<Koa.Context>;
}
export default SessionManager;
