import { Request, Response } from 'express';
import { AddCounter, IncrementCounter, ListCounters, DeleteCounter } from '../../core/useCases';

export class CounterController {
    constructor(
        private addCounterUseCase: AddCounter,
        private incrementCounterUseCase: IncrementCounter,
        private listCountersUseCase: ListCounters,
        private deleteCounterUseCase: DeleteCounter,
    ) {}

    /**
     * @swagger
     * /counters:
     *   post:
     *     summary: Add a counter (team member) to a team
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               teamId:
     *                 type: string
     *                 example: "team-1"
     *               memberName:
     *                 type: string
     *                 example: "John Doe"
     *     responses:
     *       201:
     *         description: Counter added successfully
     */
    async addCounter(req: Request, res: Response) {
        const { teamId, memberName } = req.body;
        const counter = await this.addCounterUseCase.execute(teamId, memberName);
        res.status(201).json(counter);
    }

    /**
     * @swagger
     * /increment:
     *   post:
     *     summary: Increment steps for a counter
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               teamId:
     *                 type: string
     *                 example: "team-1"
     *               counterId:
     *                 type: string
     *                 example: "counter-1"
     *               steps:
     *                 type: number
     *                 example: 200
     *     responses:
     *       200:
     *         description: Steps incremented successfully
     */
    async increment(req: Request, res: Response) {
        const { teamId, counterId, steps } = req.body;
        await this.incrementCounterUseCase.execute(teamId, counterId, steps);
        res.status(200).json({ message: 'Steps incremented successfully' });
    }

    /**
     * @swagger
     * /teams/{teamId}/counters:
     *   get:
     *     summary: List all counters for a team
     *     parameters:
     *       - in: path
     *         name: teamId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the team
     *     responses:
     *       200:
     *         description: List of counters for the team
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     example: "counter-1"
     *                   memberName:
     *                     type: string
     *                     example: "John Doe"
     *                   steps:
     *                     type: number
     *                     example: 100
     */
    async listCounters(req: Request, res: Response) {
        const { teamId } = req.params;
        const counters = await this.listCountersUseCase.execute(teamId);
        res.status(200).json(counters);
    }

    /**
     * @swagger
     * /teams/{teamId}/counters/{counterId}:
     *   delete:
     *     summary: Delete a counter from a team
     *     parameters:
     *       - in: path
     *         name: teamId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the team
     *       - in: path
     *         name: counterId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the counter to delete
     *     responses:
     *       204:
     *         description: Counter deleted successfully
     */
    async deleteCounter(req: Request, res: Response) {
        const { teamId, counterId } = req.params;
        await this.deleteCounterUseCase.execute(teamId, counterId);
        res.status(204).send();
    }
}