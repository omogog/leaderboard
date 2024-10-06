export class Lock {
    private isLocked = false;
    private waitingQueue: (() => void)[] = [];

    async acquire(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.isLocked) {
                this.isLocked = true;
                resolve();
            } else {
                this.waitingQueue.push(resolve);
            }
        });
    }

    release(): void {
        if (this.waitingQueue.length > 0) {
            const resolve = this.waitingQueue.shift();
            resolve?.();
        } else {
            this.isLocked = false;
        }
    }
}