export interface Queue {
    /**
     * Enqueue a task to be processed for a specific resource key (e.g., teamId, counterId).
     *
     * @param resourceKey - The unique identifier for the resource (e.g., teamId, counterId)
     * @param task - The asynchronous task to be executed
     */
    enqueue(resourceKey: string, task: () => Promise<void>): Promise<void>;
}