import { Team } from '../../core/entities';
import { TeamRepository } from './teamRepository';

export class InMemoryTeamRepository implements TeamRepository {
    private teams: Map<string, Team> = new Map();

    async findById(id: string): Promise<Team | null> {
        return this.teams.get(id) || null;
    }

    async findByName(teamName: string): Promise<Team | null> {
        return  Array.from(this.teams.values()).find(team => team.name === teamName) || null;
    }

    async save(team: Team): Promise<void> {
        this.teams.set(team.id, team);
    }

    async delete(id: string): Promise<void> {
        this.teams.delete(id);
    }

    async findAll(): Promise<Team[]> {
        return Array.from(this.teams.values());
    }
}