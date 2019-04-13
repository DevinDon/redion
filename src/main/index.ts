import Logger from '@iinfinity/logger';
import { Session } from './@types';

export const logger = new Logger('Redion');

export * from './@types';
export * from './Storage';

declare module 'koa' {
  interface Context {
    session: Session;
  }
}
