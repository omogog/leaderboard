import { TeamRepository } from '../../../adapters/repositories/';

export class GetTeamSteps {
    constructor(private teamRepo: TeamRepository) {}

    async execute(teamId: string): Promise<number> {
        const team = await this.teamRepo.findById(teamId);
        if (!team) throw new Error('Team not found');

        return team.counters.reduce((total, counter) => total + counter.steps, 0);
    }
}