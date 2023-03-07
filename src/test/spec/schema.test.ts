import { Schema } from '@ubio/framework';
import assert from 'assert';

interface Entity {
    id: string;
    createdAt?: number;
    updatedAt?: number;
}

interface Heartbeat extends Entity {
    group: string;
    meta?: Record<string, any> | undefined;
}

const Heartbeat = new Schema<Heartbeat>({
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

describe('Schema', () => {

    describe('preprocessed schema', () => {

        it('returns JSON Schema object', () => {
            assert.deepStrictEqual(Heartbeat.schema, {
                type: 'object',
                required: ['id', 'group'],
                properties: {
                    id: { type: 'string' },
                    group: { type: 'string' },
                    createdAt: { type: 'number', optional: true },
                    updatedAt: { type: 'number', optional: true },
                    meta: {
                        type: 'object',
                        properties: {},
                        additionalProperties: true,
                        optional: true,
                        required: [],
                    }
                },
                additionalProperties: false
            });
        });
    });

    describe('decode', () => {

        it('removes additional properties', () => {
            const heartbeat = Heartbeat.decode({
                id: '123456789',
                group: 'my-group',
                something: 'boo',
            }) as any;
            assert(typeof heartbeat.something === 'undefined');
        });

        it('throws ValidationError if not valid', () => {
            try {
                Heartbeat.decode({
                    id: '123456789',
                    group: 123
                });
                throw new Error('UnexpectedSuccess');
            } catch (err: any) {
                assert.strictEqual(err.name, 'ValidationError');
            }
        });
    });
});
