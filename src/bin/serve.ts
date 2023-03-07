#!/usr/bin/env node
import 'reflect-metadata';

import dotenv from 'dotenv';

import { App } from '../main/app.js';
import { ExpirationService } from '../main/services/ExpirationService.js';

dotenv.config();

const app: App = new App();
const expirationService: ExpirationService = app.mesh.resolve(ExpirationService);

expirationService.runExpirationTasks();

try {
    await app.start();
} catch (err: any) {
    app.logger.error('Failed to start', err);
    process.exit(1);
}
