export interface LockManager {
    // Acquire a lock for a resource key (e.g., teamId, counterId)
    acquireLock(resourceKey: string): Promise<any>;

    // Release a previously acquired lock
    releaseLock(lock: any): Promise<void>;
}