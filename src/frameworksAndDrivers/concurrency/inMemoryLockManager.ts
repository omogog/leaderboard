import { LockManager } from './lockManager';
import { Lock } from './inmemoryLock';

export class InMemoryLockManager implements LockManager {
    private locks: Map<string, Lock> = new Map();

    public async acquireLock(resourceKey: string): Promise<Lock> {
        if (!this.locks.has(resourceKey)) {
            this.locks.set(resourceKey, new Lock());
        }

        const lock = this.locks.get(resourceKey);
        await lock?.acquire();
        return lock as Lock;
    }

    public async releaseLock(lock: Lock): Promise<void> {
        lock.release();
    }
}