import express from 'express';
import bodyParser from 'body-parser';
import { TeamController, CounterController } from '../../adapters/controllers';
import {
    CreateTeam,
    AddCounter,
    IncrementCounter,
    GetTeamSteps,
    ListTeams,
    ListCounters,
    DeleteTeam,
    DeleteCounter,
} from '../../core/useCases';

import { MySQLTeamRepository, InMemoryTeamRepository } from '../../adapters/repositories';
import { InMemoryQueue, RedisQueueWithLock } from '../../adapters/queue';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from '../swagger/swaggerConfig';
import { errorHandler } from './errorHandler';
import { configService } from '../../config/configService';
import { InMemoryLockManager, RedisLockManager } from '../concurrency';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const dbConfig = configService.getDatabaseConfig();
const teamRepository =
    dbConfig.type === 'mysql'
        ? new MySQLTeamRepository(dbConfig)
        : new InMemoryTeamRepository();

const queueConfig = configService.getQueueConfig();
const lockManager = queueConfig.type === 'redis'
    ? new RedisLockManager()
    : new InMemoryLockManager();

const queue = queueConfig.type === 'redis'
    ? new RedisQueueWithLock(lockManager)
    : new InMemoryQueue(queueConfig.concurrencyLimit || 5, lockManager);

const createTeam = new CreateTeam(teamRepository);
const getTeamSteps = new GetTeamSteps(teamRepository);
const listTeams = new ListTeams(teamRepository);
const deleteTeam = new DeleteTeam(teamRepository);

const addCounter = new AddCounter(teamRepository);
const incrementCounter = new IncrementCounter(teamRepository);
const listCounters = new ListCounters(teamRepository);
const deleteCounter = new DeleteCounter(teamRepository);

const teamController = new TeamController(
    createTeam,
    getTeamSteps,
    listTeams,
    deleteTeam,
);

const counterController = new CounterController(
    addCounter,
    incrementCounter,
    listCounters,
    deleteCounter,
);

app.post('/teams', (req, res, next) =>
    queue.enqueue('team_global', () => teamController.create(req, res)).catch(next),
);
app.get('/teams/:teamId/steps', (req, res, next) =>
    teamController.getTeamSteps(req, res).catch(next),
);
app.get('/teams', (req, res, next) =>
    teamController.listTeams(req, res).catch(next),
);
app.delete('/teams/:teamId', (req, res, next) =>
    queue.enqueue(req.params.teamId, () => teamController.delete(req, res)).catch(next),
);

app.post('/counters', (req, res, next) =>
    queue.enqueue(req.body.teamId, () => counterController.addCounter(req, res)).catch(next),
);
app.post('/increment', (req, res, next) =>
    queue.enqueue(req.body.counterId, () => counterController.increment(req, res)).catch(next),
);
app.get('/teams/:teamId/counters', (req, res, next) =>
    counterController.listCounters(req, res).catch(next),
);
app.delete('/teams/:teamId/counters/:counterId', (req, res, next) =>
    queue.enqueue(req.params.counterId, () => counterController.deleteCounter(req, res)).catch(next),
);

app.use(errorHandler);

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server is running on http://localhost:${port}`);
});

// tslint:disable-next-line:no-console
console.log(`Swagger: http://localhost:${port}/api-docs`);