import { TeamRepository } from '../../../adapters/repositories';
import { Counter } from '../../entities';
import { v4 as uuidv4 } from 'uuid';

export class AddCounter {
    constructor(private teamRepo: TeamRepository) {}

    async execute(teamId: string, memberName: string): Promise<Counter> {
        const counter: Counter = { id: uuidv4(), steps: 0, memberName };
        const team = await this.teamRepo.findById(teamId);
        if (!team) throw new Error('Team not found');
        team.counters.push(counter);
        await this.teamRepo.save(team);

        return counter;
    }
}