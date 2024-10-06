import { TeamRepository } from '../../../adapters/repositories';
import { Team } from '../../entities';
import { v4 as uuidv4 } from 'uuid';

export class CreateTeam {
    constructor(private teamRepo: TeamRepository) {}

    async execute(name: string): Promise<Team> {
        const team: Team = { id: uuidv4(), name, counters: [] };
        const existingTeam = await this.teamRepo.findByName(name);

        if (existingTeam) throw new Error('Team already exists');

        await this.teamRepo.save(team);
        return team;
    }
}