import { TeamRepository } from '../../../adapters/repositories';

export class IncrementCounter {
    constructor(private teamRepo: TeamRepository) {}

    async execute(teamId: string, counterId: string, steps: number): Promise<void> {
        const team = await this.teamRepo.findById(teamId);
        if (!team) throw new Error('Team not found');

        const counter = team.counters.find(c => c.id === counterId);
        if (!counter) throw new Error('Counter not found');

        counter.steps += steps;
        await this.teamRepo.save(team);
    }
}