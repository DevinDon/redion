import { readFileSync, writeFileSync } from 'fs';
import { Storage } from '.';
import { logger } from '..';
import { DBFile, Option, Session } from '../@types';

export class Local implements Storage {

  private storage: Map<string, any>;

  /**
   * Create local session storage.
   *
   * @param {Option} option Local session option.
   */
  constructor(private option: Option) {
    this.storage = new Map();
  }

  async close(): Promise<void> { }

  async delete(id: string): Promise<boolean> {
    this.storage.delete(`expire-${id}`);
    return this.storage.delete(id);
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
    if (this.storage.has(id)) {
      const session: Session = this.storage.get(id);
      if (session.__expireAt > Date.now()) { // refresh successfully
        session.__expireAt = Date.now() + this.option.expire * 1000;
        return true;
      } else { // session timeout
        this.storage.delete(id);
        logger.info(`Session timeout, ID: ${id}`);
        return false;
      }
    } else { // session not found
      logger.info(`No such session, ID: ${id}`);
      return false;
    }
  }

  // TO-DO: Save session to local.
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
    return Boolean(this.storage.set(session.id, session));
  }

}

export default Local;
