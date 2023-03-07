import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';
import { Collection, ReturnDocument } from 'mongodb';

import { Heartbeat, Summary } from '../schema/Heartbeat.js';

export class HeartbeatRepository {
    @dep() private mongodb!: MongoDb;

    protected get collection(): Collection<Heartbeat> {
        return this.mongodb.db.collection<Heartbeat>('heartbeats');
    }

    async getSummary(): Promise<Summary[]> {
        const pipeline = [
            {
                $group: {
                    _id: '$group',
                    instances: { $sum: 1 },
                    createdAt: { $min: '$createdAt' },
                    lastUpdatedAt: { $max: '$updatedAt' }
                }
            },
            {
                $project: {
                    _id: 0,
                    group: '$_id',
                    instances: 1,
                    createdAt: 1,
                    lastUpdatedAt: 1
                }
            }
        ];

        const result = await this.collection.aggregate(pipeline).toArray();
        return result as Summary[];
    }

    async upsertHeartbeat(heartbeat: Heartbeat): Promise<Heartbeat> {
        const filter = { id: heartbeat.id, group: heartbeat.group };
        const update = {
            $setOnInsert: {
                id: heartbeat.id,
                group: heartbeat.group,
                meta: heartbeat.meta,
                createdAt: Date.now(),
            },
            $set: {
                updatedAt: Date.now()
            }
        };
        const projection = { _id: 0 };
        const options = { projection, upsert: true, returnDocument: ReturnDocument.AFTER };
        const result = await this.collection.findOneAndUpdate(filter, update, options);

        return result.value as Heartbeat;
    }

    async getHeartbeatByGroup(group: string): Promise<Heartbeat[] | null> {
        const result = await this.collection.find({ group }, {
            projection: {
                '_id': 0
            }
        }).toArray();
        return result || null;
    }

    async deleteHeartbeat(group: string, id: string): Promise<boolean> {
        const result = await this.collection.deleteOne({ group, id });
        return result.deletedCount === 1;
    }
}
