import IORedis from 'ioredis';
import { Storage } from '.';
import { Option, Session } from '../@types';
import { logger } from '..';

export class Redis implements Storage {

  private storage: IORedis.Redis;

  constructor(private option: Option) {
    option.redis = Object.assign(
      { retryStrategy: (times: number) => times * 1000 },
      option.redis
    );
    this.storage = new IORedis(option.redis);
    this.storage.on('connect', v => {
      logger.info(`Redis storage connected.`);
    });
    this.storage.on('error', err => {
      logger.error(`Redis storage connection error: ${err}`);
    });
  }

  async close(): Promise<void> {
    return this.storage.disconnect();
  }

  async delete(id: string): Promise<boolean> {
    return (this.storage.del(id) as Promise<number>)
      .then(v => Boolean(v))
      .catch(r => false);
  }

  async get<T = Session>(id: string): Promise<T | undefined> {
    return this.storage.get(id)
      .then(v => v ? JSON.parse(v) : undefined)
      .catch(r => undefined);
  }

  async read(path: string): Promise<boolean> {
    return true;
  }

  async refresh(id: string): Promise<boolean> {
    return this.storage.expire(id, this.option.expire)
      .then(v => Boolean(v))
      .catch(r => false);
  }

  async save(): Promise<boolean> {
    return this.storage.save()
      .then(v => true)
      .catch(r => false);
  }

  async set(session: Session): Promise<boolean> {
    return this.storage.set(session.id, JSON.stringify(session))
      .then(v => true)
      .catch(r => false);
  }

}

export default Redis;
