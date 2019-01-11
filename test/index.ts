import Koa from 'koa';
import { RediSession } from '../dist';

const app = new Koa();
const session = new RediSession(app, { domain: 'localhost' }).ware;

app.use(session);

app.listen(80);
