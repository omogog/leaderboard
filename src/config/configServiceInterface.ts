export interface DatabaseConfig {
    type: 'in-memory' | 'mysql';
    host?: string;
    user?: string;
    password?: string;
    database?: string;
    connectionLimit?: number;
}

export interface QueueConfig {
    type: 'in-memory' | 'redis';
    concurrencyLimit?: number;
    redisHost?: string;
    redisPort?: number;
}

export interface ConfigServiceInterface {
    getDatabaseConfig(): DatabaseConfig;
    getQueueConfig(): QueueConfig;
}