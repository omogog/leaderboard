import dotenv from 'dotenv';
import { ConfigServiceInterface, DatabaseConfig, QueueConfig } from './configServiceInterface';

dotenv.config();

export class ConfigService implements ConfigServiceInterface {
    getDatabaseConfig(): DatabaseConfig {
        const dbType = process.env.DB_TYPE || 'in-memory';

        if (dbType === 'mysql') {
            return {
                type: 'mysql',
                host: process.env.MYSQL_HOST || 'localhost',
                user: process.env.MYSQL_USER || 'root',
                password: process.env.MYSQL_PASSWORD || '',
                database: process.env.MYSQL_DATABASE || 'steps_leaderboard',
                connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT || '10', 10),
            };
        }

        return { type: 'in-memory' };
    }

    getQueueConfig(): QueueConfig {
        const queueType = process.env.QUEUE_TYPE || 'in-memory';

        if (queueType === 'redis') {
            return {
                type: 'redis',
                redisHost: process.env.REDIS_HOST || 'localhost',
                redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
            };
        }

        return {
            type: 'in-memory',
            concurrencyLimit: parseInt(process.env.CONCURRENCY_LIMIT || '5', 10),
        };
    }
}

export const configService = new ConfigService();