import { Application } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

import { HeartbeatRepository } from './repositories/HeartbeatRepository.js';
import { HeartbeatRouter } from './routes/HeartbeatRouter.js';
import { CronService } from './services/CronService.js';
import { ExpirationService } from './services/ExpirationService.js';

export class App extends Application {

    // Note: application can inject global-scoped components
    @dep() private mongoDb!: MongoDb;

    override createGlobalScope() {
        const mesh = super.createGlobalScope();
        mesh.service(MongoDb);
        mesh.service(CronService);
        mesh.service(ExpirationService);
        mesh.service(HeartbeatRepository);
        return mesh;
    }

    override createHttpRequestScope() {
        const mesh = super.createHttpRequestScope();
        mesh.service(HeartbeatRouter);
        return mesh;
    }

    override async beforeStart() {
        await this.mongoDb.client.connect();
        // Add other code to execute on application startup
        await this.httpServer.startServer();
    }

    override async afterStop() {
        await this.httpServer.stopServer();
        // Add other finalization code
        this.mongoDb.client.close();
    }

}
