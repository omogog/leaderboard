import Bull from 'bull';
import { Queue } from './queue';
import { LockManager } from '../../frameworksAndDrivers/concurrency';

export class RedisQueueWithLock implements Queue {
    private queue: Bull.Queue;
    private lockManager: LockManager;

    constructor(lockManager: LockManager) {
        this.queue = new Bull('stepsQueue', {
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379', 10),
            },
        });

        this.lockManager = lockManager;
        this.process();
    }

    public async enqueue(resourceKey: string, task: () => Promise<void>): Promise<void> {
        await this.queue.add({ resourceKey, task });
    }

    private process(): void {
        this.queue.process(async (job, done) => {
            const { resourceKey, task } = job.data;
            let lock;

            try {
                // Acquire Redis lock for the resource (e.g., counter or team)
                lock = await this.lockManager.acquireLock(resourceKey);

                await task();

                done();
            } catch (error) {
                // tslint:disable-next-line: no-console
                console.log(`Error processing task: ${error}`);
                done();
            } finally {
                if (lock) {
                    await this.lockManager.releaseLock(lock);
                }
            }
        });
    }
}