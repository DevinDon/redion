import { Session } from './index';
declare module 'koa' {
    interface Context {
        session: Session;
    }
}
