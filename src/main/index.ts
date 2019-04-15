import Logger from '@iinfinity/logger';
import { Session } from './@types';

export const logger = new Logger('Redion');

export * from './@types';
export * from './Redion';
export * from './storage';

declare module 'koa' {
  interface Context {
    session: Session;
  }
}
