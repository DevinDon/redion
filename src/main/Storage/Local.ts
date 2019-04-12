import { readFileSync, writeFileSync } from 'fs';
import { Storage } from '.';
import { logger } from '..';
import { DBFile, Option, Session } from '../@types';

export class Local implements Storage {

  /** Storage, memory. */
  private storage: Map<string, any> = new Map();
  /** Expire map. */
  private expire: Map<string, number> = new Map();

  /**
   * Create local session storage.
   *
   * @param {Option} option Local session option.
   */
  constructor(private option: Option) { }

  async close(): Promise<void> { }

  async delete(id: string): Promise<boolean> {
    try {
      this.storage.delete(id);
      this.expire.delete(id);
      return true;
    } catch (err) {
      logger.error(`Cannot delete session: ${err}`);
      return false;
    }
  }

  async get<T = Session>(id: string): Promise<T | undefined> {
    return (await this.refresh(id)) ? this.storage.get(id) : undefined;
  }

  async read(path: string): Promise<boolean> {
    try {
      const text = readFileSync(path).toString();
      const db: DBFile = JSON.parse(text);
      for (let i = 0; i < db.size; i++) {
        this.storage.set(db.keys[i], db.values[i]);
      }
      logger.info(`Load session DB successfully, size: ${this.storage.size}`);
      return true;
    } catch (err) {
      logger.error(`Cannot read session from file, path: ${path}`);
      return false;
    }
  }

  async refresh(id: string): Promise<boolean> {
    logger.debug('keys: ', Array.from(this.storage.keys()));
    logger.debug('values: ', JSON.stringify(Array.from(this.storage.values())));
    if (this.expire.has(id) && this.storage.has(id)) {
      if (this.expire.get(id) as number > Date.now()) { // refresh successfully
        this.expire.set(id, Date.now() + this.option.expire * 1000);
        return true;
      } else { // session timeout
        this.storage.delete(id);
        this.expire.delete(id);
        logger.debug(`Session timeout, ID: ${id}`);
        return false;
      }
    } else { // session not found
      this.storage.delete(id);
      this.expire.delete(id);
      logger.debug(`No such session, ID: ${id}`);
      return false;
    }
  }

  async save(): Promise<boolean> {
    if (this.option.file) {
      try {
        writeFileSync(this.option.file, {
          keys: JSON.stringify(Array.from(this.storage.keys())),
          values: JSON.stringify(Array.from(this.storage.values())),
          size: this.storage.size
        });
        logger.info(`DB saved, path: ${this.option.file}`);
        return true;
      } catch (err) {
        logger.error(`Cannot save session to file: ${err}`);
        return false;
      }
    } else {
      logger.warn(`No local session file provided, session not saved.`);
      return false;
    }
  }

  async set(session: Session): Promise<boolean> {
    try {
      this.storage.set(session.id, session);
      this.expire.set(session.id, Date.now() + this.option.expire * 1000);
      return true;
    } catch (err) {
      this.storage.delete(session.id);
      this.expire.delete(session.id);
      logger.error(`Cannot set session: ${err}`);
      return false;
    }
  }

}

export default Local;
