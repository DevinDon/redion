import { Session } from './type';

export * from './RediSession';
export * from './type';

declare module 'koa' {
  interface Context {
    session: Session;
  }
}
