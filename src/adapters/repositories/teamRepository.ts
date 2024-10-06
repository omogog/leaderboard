import { Team } from '../../core/entities';

export interface TeamRepository {
    findById(id: string): Promise<Team | null>;
    findByName(teamName: string): Promise<Team | null>;
    save(team: Team): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Team[]>;
}