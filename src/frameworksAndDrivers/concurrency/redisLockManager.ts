import Redis from 'ioredis';
import Redlock, {Lock} from 'redlock';

import {LockManager} from './lockManager';

export class RedisLockManager implements LockManager {
    private redlock: Redlock;

    constructor() {
        const redisClient = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
        });

        this.redlock = new Redlock(
            [redisClient],
            {
                driftFactor: 0.01,
                retryCount: 10,
                retryDelay: 200,
                retryJitter: 200,
            },
        );
    }

    public async acquireLock(resourceKey: string): Promise<Lock> {
        try {
            return await this.redlock.acquire([`locks:${resourceKey}`], 5000);
        } catch (err) {
            throw new Error(`Could not acquire lock for ${resourceKey}: ${err}`);
        }
    }

    public async releaseLock(lock: Lock): Promise<void> {
        try {
            await lock.release();
        } catch (err) {
            throw new Error(`Failed to release lock: ${err}`);
        }
    }
}