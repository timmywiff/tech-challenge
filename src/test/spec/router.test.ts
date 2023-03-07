import { Application } from '@ubio/framework';
import assert from 'assert';
import supertest from 'supertest';

import { HeartbeatRouter } from '../routes/heartbeat.js';

describe('Router', () => {

    describe('request dispatching', () => {

        class App extends Application {

            override createHttpRequestScope() {
                const mesh = super.createHttpRequestScope();
                mesh.service(HeartbeatRouter);
                return mesh;
            }

            override async beforeStart() {
                await this.httpServer.startServer();
            }

            override async afterStop() {
                await this.httpServer.stopServer();
            }
        }

        const app = new App();
        beforeEach(() => app.start());
        afterEach(() => app.stop());

        it('GET /', async () => {
            const request = supertest(app.httpServer.callback());
            const res = await request.get('/');
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.header['heartbeat-before-all'], 'true');
            assert(res.header['heartbeat-before-get-one'] == null);
            assert.deepStrictEqual(res.body, [{
                id: '123456789',
                group: 'group-one',
                createdAt: 1678180728906,
                updatedAt: 1678180728906,
                meta: {
                    foo: 'bar'
                }
            },
            {
                id: '123456790',
                group: 'group-two',
                createdAt: 1678180728907,
                updatedAt: 1678180728907
            }]);
        });

        it('GET /{group}', async () => {
            const request = supertest(app.httpServer.callback());
            const res = await request.get('/group-one');
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.header['heartbeat-before-all'], 'true');
            assert.strictEqual(res.header['heartbeat-before-get-one'], 'group-one');
            assert.deepStrictEqual(res.body, {
                id: '123456789',
                group: 'group-one',
                createdAt: 1678180728906,
                updatedAt: 1678180728906,
                meta: {
                    foo: 'bar'
                }
            });
        });

        it('POST /{group}/{id}', async () => {
            const group = 'group-one';
            const id = '123456789';
            const meta = {
                foo: 'bar'
            };
            const ts = 1678180728906;
            const request = supertest(app.httpServer.callback());
            const res = await request.post('/group-one/123456789').send({ meta });

            assert.strictEqual(res.header['heartbeat-before-all'], 'true');
            assert.deepStrictEqual(res.body, { id, group, meta, createdAt: ts, updatedAt: ts });
        });

        it('DELETE /{group}/{id}', async () => {
            const request = supertest(app.httpServer.callback());
            const res = await request.delete('/group-one/123456789');
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.header['heartbeat-before-all'], 'true');
            assert.deepStrictEqual(res.body, { id: '123456789', group: 'group-one' });
        });
    });
});
