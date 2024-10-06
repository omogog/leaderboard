import { Request, Response } from 'express';
import { CreateTeam, GetTeamSteps, ListTeams, DeleteTeam  } from '../../core/useCases';

export class TeamController {
    constructor(
        private createTeamUseCase: CreateTeam,
        private getTeamStepsUseCase: GetTeamSteps,
        private listTeamsUseCase: ListTeams,
        private deleteTeamUseCase: DeleteTeam,
    ) {}

    /**
     * @swagger
     * /teams:
     *   post:
     *     summary: Create a new team
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Team Alpha"
     *     responses:
     *       201:
     *         description: Team created successfully
     */
    async create(req: Request, res: Response) {
        const { name } = req.body;
        const team = await this.createTeamUseCase.execute(name);
        res.status(201).json(team);
    }

    /**
     * @swagger
     * /teams/{teamId}/steps:
     *   get:
     *     summary: Get total steps for a team
     *     parameters:
     *       - in: path
     *         name: teamId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the team
     *     responses:
     *       200:
     *         description: Total steps for the team
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 totalSteps:
     *                   type: number
     *                   example: 1200
     */
    async getTeamSteps(req: Request, res: Response) {
        const { teamId } = req.params;
        const totalSteps = await this.getTeamStepsUseCase.execute(teamId);
        res.status(200).json({ totalSteps });
    }

    /**
     * @swagger
     * /teams:
     *   get:
     *     summary: List all teams
     *     responses:
     *       200:
     *         description: List of teams
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     example: "team-1"
     *                   name:
     *                     type: string
     *                     example: "Team Alpha"
     *                   counters:
     *                     type: array
     *                     items:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                           example: "counter-1"
     *                         memberName:
     *                           type: string
     *                           example: "John Doe"
     *                         steps:
     *                           type: number
     *                           example: 100
     */
    async listTeams(req: Request, res: Response) {
        const teams = await this.listTeamsUseCase.execute();
        res.status(200).json(teams);
    }

    /**
     * @swagger
     * /teams/{teamId}:
     *   delete:
     *     summary: Delete a team
     *     parameters:
     *       - in: path
     *         name: teamId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the team to delete
     *     responses:
     *       204:
     *         description: Team deleted successfully
     */
    async delete(req: Request, res: Response) {
        const { teamId } = req.params;
        await this.deleteTeamUseCase.execute(teamId);
        res.status(204).send();
    }
}