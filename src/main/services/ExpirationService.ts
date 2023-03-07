import { config, Logger } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';
import { Collection, DeleteResult } from 'mongodb';

import { Heartbeat } from '../schema/Heartbeat.js';
import { CronService } from './CronService.js';

export class ExpirationService {
    @dep() logger!: Logger;
    @dep() private mongodb!: MongoDb;
    @dep() cronService!: CronService;

    @config({ default: 86400 }) EXPIRATION_THRESHOLD!: number;

    protected get collection(): Collection<Heartbeat> {
        return this.mongodb.db.collection<Heartbeat>('heartbeats');
    }

    async deleteOlderThan(seconds: number): Promise<void> {
        const cutoff = Date.now() - seconds * 1000;
        const result: DeleteResult = await this.collection.deleteMany({ updatedAt: { $lt: cutoff } });
        this.logger.info(`Deleted ${result.deletedCount} expired records`);
    }

    async runExpirationTasks(): Promise<void> {
        this.cronService.runMinutely(() => this.deleteOlderThan(this.EXPIRATION_THRESHOLD));
    }
}
