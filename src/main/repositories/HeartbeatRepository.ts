import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';
import { Collection, ReturnDocument } from 'mongodb';

import { Heartbeat } from '../schema/Heartbeat.js';

export class HeartbeatRepository {
    @dep() private mongodb!: MongoDb;

    protected get collection(): Collection<Heartbeat> {
        return this.mongodb.db.collection<Heartbeat>('heartbeats');
    }

    async getHeartbeats(): Promise<Heartbeat[]> {
        const result = await this.collection.find({}, { projection: { _id: 0 } }).toArray();
        return result;
    }

    async upsertHeartbeat(heartbeat: Heartbeat): Promise<Heartbeat> {
        const filter = { id: heartbeat.id };
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

    async getHeartbeatByGroup(group: string): Promise<Heartbeat | null> {
        const result = await this.collection.findOne({ group }, {
            projection: {
                '_id': 0
            }
        });
        return result || null;
    }

    async deleteHeartbeatById(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne({ id });
        return result.deletedCount === 1;
    }
}
