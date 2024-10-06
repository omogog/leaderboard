import { TeamRepository } from '../../../adapters/repositories';

export class ListCounters {
    constructor(private teamRepo: TeamRepository) {}

    async execute(teamId: string) {
        const team = await this.teamRepo.findById(teamId);
        if (!team) throw new Error('Team not found');

        return team.counters;
    }
}