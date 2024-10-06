import { TeamRepository } from '../../../adapters/repositories';

export class DeleteTeam {
    constructor(private teamRepo: TeamRepository) {}

    async execute(teamId: string): Promise<void> {
        await this.teamRepo.delete(teamId);
    }
}