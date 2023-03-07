import { Schema } from '@ubio/framework';

interface Entity {
    id: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface Heartbeat extends Entity {
    group: string;
    meta?: Record<string, any> | undefined;
}

export interface Summary {
    group: string;
    instances: number;
    createdAt: number;
    lastUpdatedAt: number;
}

export const Heartbeat = new Schema<Heartbeat>({
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
});
