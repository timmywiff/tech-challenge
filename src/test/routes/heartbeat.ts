import { Delete, Get, Middleware, PathParam, Post, Router } from '@ubio/framework';

const heartbeatOne = {
    id: '123456789',
    group: 'group-one',
    createdAt: 1678180728906,
    updatedAt: 1678180728906,
    meta: {
        foo: 'bar'
    }
};

const heartbeatTwo = {
    id: '123456790',
    group: 'group-two',
    createdAt: 1678180728907,
    updatedAt: 1678180728907
};

export class HeartbeatRouter extends Router {
    @Middleware()
    async beforeAll() {
        this.ctx.set('heartbeat-before-all', 'true');
    }

    @Middleware({ path: '/{group}' })
    async beforeGetOne(
        @PathParam('group', { schema: { type: 'string' } })
        group: string
    ) {
        this.ctx.set('heartbeat-before-get-one', group);
    }

    @Get({
        path: '/',
        responses: {
            200: {
                schema: {
                    type: 'array',
                    items: {
                        schema: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                group: { type: 'string' },
                                createdAt: { type: 'number', optional: true },
                                updatedAt: { type: 'number', optional: true },
                                meta: { type: 'object', properties: {}, additionalProperties: true, optional: true, }
                            }
                        }
                    }
                }
            }
        }
    })
    async getAll() {
        return [heartbeatOne, heartbeatTwo];
    }

    @Get({
        path: '/{group}',
        responses: {
            200: {
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        group: { type: 'string' },
                        createdAt: { type: 'number', optional: true },
                        updatedAt: { type: 'number', optional: true },
                        meta: { type: 'object', properties: {}, additionalProperties: true, optional: true, }
                    }
                }
            }
        }
    })
    async getOne() {
        return heartbeatOne;
    }

    @Post({
        path: '/{group}/{id}',
        responses: {
            200: {
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        group: { type: 'string' },
                        createdAt: { type: 'number', optional: true },
                        updatedAt: { type: 'number', optional: true },
                        meta: { type: 'object', properties: {}, additionalProperties: true, optional: true, }
                    },
                    required: ['id', 'group'],
                    additionalProperties: false,
                }
            }
        }
    })
    async upsert() {
        return heartbeatOne;
    }

    @Delete({
        path: '/{group}/{id}',
        responses: {
            200: { contentType: 'application/json' }
        }
    })
    async delete(
        @PathParam('group', { schema: { type: 'string' } })
        group: string,
        @PathParam('id', { schema: { type: 'string' } })
        id: string
    ) {
        return { group, id };
    }
}
