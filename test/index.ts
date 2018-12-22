import Koa, { Middleware } from 'koa';
import { RediSession } from '../src';

const app = new Koa();
const session = new RediSession(app, { name: 'session.id' }).ware;

app.use(session);

app.listen(80);
