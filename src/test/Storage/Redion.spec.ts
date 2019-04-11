import { Redis, Storage, Option, Session } from '../../main';

describe('local storage test', () => {

  let storage: Storage;

  beforeAll(done => {
    const option: Option = {
      name: 'session.id',
      expire: 0,
      domain: 'localhost',
      koa: {} as any,
      redis: {
        host: 'a-1.don.red'
      },
      secert: ['secert', 'key']
    };
    storage = new Redis(option);
    done();
  });

  it('should be set correctly', async done => {
    const session: Session = { __expireAt: Date.now() + 10 * 1000, id: '1', text: Date.now() };
    expect(await storage.set(session)).toBeTruthy();
    expect(await storage.get<Session>(session.id)).toBe(session);
    done();
  });

  it('should expire correctly', async done => {
    const session: Session = { __expireAt: Date.now(), id: '1', text: Date.now() };
    expect(await storage.set(session)).toBeTruthy();
    expect(await storage.get(session.id)).toBeUndefined();
    done();
  });

});
