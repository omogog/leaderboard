import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Steps Leaderboard API',
            version: '1.0.0',
            description: 'API for managing team step counters in a leaderboard',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./src/**/*.ts'],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);