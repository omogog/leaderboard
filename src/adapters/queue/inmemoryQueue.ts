import { Queue } from './queue';
import { LockManager } from '../../frameworksAndDrivers/concurrency';

export class InMemoryQueue implements Queue {
    private taskQueue: Map<string, (() => Promise<void>)[]> = new Map();
    private isProcessing: Map<string, boolean> = new Map();
    private concurrencyLimit: number;
    private lockManager: LockManager;

    constructor(concurrencyLimit: number, lockManager: LockManager) {
        this.concurrencyLimit = concurrencyLimit;
        this.lockManager = lockManager;
    }

    public async enqueue(resourceKey: string, task: () => Promise<void>): Promise<void> {
        if (!this.taskQueue.has(resourceKey)) {
            this.taskQueue.set(resourceKey, []);
        }
        const queue = this.taskQueue.get(resourceKey);
        queue?.push(task);
        await this.process(resourceKey);
    }

    private async process(resourceKey: string): Promise<void> {
        if (this.isProcessing.get(resourceKey)) {
            return;
        }

        const queue = this.taskQueue.get(resourceKey);
        if (!queue || queue.length === 0) {
            return;
        }

        this.isProcessing.set(resourceKey, true);

        const lock = await this.lockManager.acquireLock(resourceKey);

        try {
            const tasksToProcess = queue.splice(0, this.concurrencyLimit);
            await Promise.all(tasksToProcess.map(task => task()));

        } finally {
            this.isProcessing.set(resourceKey, false);
            this.lockManager.releaseLock(lock);

            if (queue.length > 0) {
                this.process(resourceKey);
            }
        }
    }
}