import { Redis, Storage, Option, Session } from '../../main';

describe('redis storage test', () => {

  let storage: Storage;
  let session: Session;

  beforeAll(done => {
    const option: Option = {
      name: 'session.id',
      expire: 1,
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

  beforeEach(done => {
    session = { id: '1', text: Date.now() };
    done();
  });

  afterEach(done => {
    storage.delete(session.id);
    done();
  });

  it('should be set correctly', async done => {
    expect(await storage.set(session)).toBeTruthy();
    expect(await storage.get<Session>(session.id)).toEqual(session);
    done();
  });

  it('should expire correctly', async done => {
    expect(await storage.set(session)).toBeTruthy();
    setTimeout(async () => {
      expect(await storage.get(session.id)).toBeUndefined();
      done();
    }, 1000);
  });

});
