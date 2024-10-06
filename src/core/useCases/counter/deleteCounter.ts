import { TeamRepository } from '../../../adapters/repositories';

export class DeleteCounter {
    constructor(private teamRepo: TeamRepository) {}

    async execute(teamId: string, counterId: string): Promise<void> {
        const team = await this.teamRepo.findById(teamId);
        if (!team) throw new Error('Team not found');

        const counterIndex = team.counters.findIndex(c => c.id === counterId);
        if (counterIndex === -1) throw new Error('Counter not found');

        team.counters.splice(counterIndex, 1);
        await this.teamRepo.save(team);
    }
}