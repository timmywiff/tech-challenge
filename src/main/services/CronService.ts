import { Logger } from '@ubio/framework';
import { dep } from 'mesh-ioc';
import cron from 'node-cron';

export class CronService {
    @dep() logger!: Logger;

    runDaily(task: () => void) {
        this.logger.info('Initiating daily cron');
        cron.schedule('0 0 * * *', task);
    }

    runHourly(task: () => void) {
        this.logger.info('Initiating hourly cron');
        cron.schedule('0 * * * *', task);
    }

    runMinutely(task: () => void) {
        this.logger.info('Initiating minutely cron');
        cron.schedule('* * * * *', task);
    }
}
