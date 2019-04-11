export * from './Local';
export * from './Redis';

import { Session } from '../@types';

export interface Storage {

  /**
   * Close storage.
   *
   * @returns {Promise<void>} Nothing.
   */
  close(): Promise<void>;

  /**
   * Delete session from storage.
   *
   * @param {string} id Session ID.
   * @returns {Promise<boolean>} Success or not.
   */
  delete(id: string): Promise<boolean>;

  /**
   * Get session information from storage.
   *
   * @param {string} id Session ID.
   * @returns {Promise<T | undefined>} Session.
   */
  get<T = Session>(id: string): Promise<T | undefined>;

  /**
   * Read session from file.
   *
   * @param {string} path File storage path.
   * @returns {boolean} Success or not.
   */
  read(path: string): Promise<boolean>;

  /**
   * Refresh session exprise time.
   *
   * @param {string} id Session ID.
   * @returns {Promise<boolean>} Success or not.
   */
  refresh(id: string): Promise<boolean>;

  /**
   * Save data to disk.
   *
   * @returns {Promise<boolean>} Success or not.
   */
  save(): Promise<boolean>;

  /**
   * Add or update session to storage.
   *
   * @param {Session} session Session.
   * @returns {Promise<boolean>} Success or not.
   */
  set(session: Session): Promise<boolean>;

}
