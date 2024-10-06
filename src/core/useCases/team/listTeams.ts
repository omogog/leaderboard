import { TeamRepository } from '../../../adapters/repositories';

export class ListTeams {
    constructor(private teamRepo: TeamRepository) {}

    async execute() {
        return await this.teamRepo.findAll();
    }
}