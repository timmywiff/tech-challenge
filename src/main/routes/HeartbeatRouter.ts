import { BodyParam, Delete, Get, PathParam, Post, Router } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { HeartbeatRepository } from '../repositories/HeartbeatRepository.js';
import { Heartbeat } from '../schema/Heartbeat.js';

export class HeartbeatRouter extends Router {
    @dep() private heartbeatRespository!: HeartbeatRepository;

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
                                group: { type: 'string' },
                                instances: { type: 'number' },
                                createdAt: { type: 'number' },
                                updatedAt: { type: 'number' },
                            }
                        }
                    }
                }
            }
        }
    })
    async list() {
        return this.heartbeatRespository.getSummary();
    }

    @Post({
        path: '/{group}/{id}',
        responses: {
            200: {
                schema: Heartbeat.schema
            }
        }
    })
    async upsert(
        @PathParam('group', { schema: { type: 'string' } })
        group: string,
        @PathParam('id', { schema: { type: 'string' } })
        id: string,
        @BodyParam('meta', { schema: { type: 'object', properties: {}, additionalProperties: true, optional: true, }, required: false })
        meta: Record<string, any> | undefined
    ) {
        return this.heartbeatRespository.upsertHeartbeat({ id, group, meta });
    }

    @Get({
        path: '/{group}',
        responses: {
            200: {
                schema: {
                    type: 'array',
                    items: Heartbeat.schema
                }
            }
        }
    })
    async get(
        @PathParam('group', { schema: { type: 'string' } })
        group: string
    ) {
        return this.heartbeatRespository.getHeartbeatsByGroup(group);
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
        return this.heartbeatRespository.deleteHeartbeat(group, id);
    }
}
