import { delay } from '@iinfinity/delay';
import { Redis, Option, Session, Storage } from '../../main';

describe('redis storage test', () => {

  let storage: Storage;
  let session: Session;

  beforeAll(done => {
    const option: Option = {
      name: 'session.id',
      expire: 1,
      domain: 'localhost',
      redis: {
        host: 'a-1.don.red'
      },
      secert: ['secert', 'key']
    };
    storage = new Redis(option);
    done();
  });

  beforeEach(done => {
    session = { id: '1', text: Date.now() };
    done();
  });

  afterEach(done => {
    storage.delete(session.id);
    done();
  });

  it('should get & set correctly', async done => {
    expect(await storage.set(session)).toBeTruthy();
    expect(await storage.get<Session>(session.id)).toEqual(session);
    done();
  });

  it('should expire correctly', async done => {
    expect(await storage.set(session)).toBeTruthy();
    expect(await delay(1000, () => storage.get(session.id))).toBeUndefined();
    done();
  });

  it('should delete correctly', async done => {
    expect(await storage.set(session)).toBeTruthy();
    expect(await storage.delete(session.id)).toBeTruthy();
    expect(await storage.get(session.id)).toBeUndefined();
    done();
  });

  it('should refresh correctly', async done => {
    expect(await storage.set(session)).toBeTruthy();
    expect(await delay(600, () => storage.refresh(session.id))).toBeTruthy();
    expect(await delay(600, () => storage.get(session.id))).toEqual(session);
    done();
  });

});
