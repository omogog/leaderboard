import { createPool, Pool } from 'mysql2/promise';
import { TeamRepository } from './teamRepository';
import { Team, Counter } from '../../core/entities';
import { DatabaseConfig} from '../../config/configServiceInterface';

export class MySQLTeamRepository implements TeamRepository {
    private pool: Pool;
    constructor(private dbConfig: DatabaseConfig) {

        if (this.dbConfig.type !== 'mysql') {
            throw new Error('MySQL configuration is required.');
        }

        this.pool = createPool({
            host: this.dbConfig.host,
            user: this.dbConfig.user,
            password: this.dbConfig.password,
            database: this.dbConfig.database,
            waitForConnections: true,
            connectionLimit: this.dbConfig.connectionLimit || 10,
            queueLimit: 0,
        });
    }

    public async findById(id: string): Promise<Team | null> {
        const connection = await this.pool.getConnection();
        try {
            const [teamRows] = await connection.execute(
                'SELECT id, name FROM teams WHERE id = ?',
                [id],
            ) as unknown as [Team[]];

            if (teamRows.length === 0) {
                return null;
            }

            const teamData = teamRows[0] as { id: string; name: string };

            const [counterRows] = await connection.execute(
                'SELECT id, memberName, steps FROM counters WHERE teamId = ?',
                [id],
            ) as unknown as [Counter[]];

            const counters: Counter[] = counterRows.map((row: any) => ({
                id: row.id,
                memberName: row.memberName,
                steps: row.steps,
            }));

            return {
                id: teamData.id,
                name: teamData.name,
                counters,
            };
        } finally {
            connection.release();
        }
    }

    public async findByName(teamName: string): Promise<Team | null> {
        const connection = await this.pool.getConnection();
        try {
            const [teamRows] = await connection.execute(
                'SELECT id, name FROM teams WHERE name = ?',
                [teamName],
            ) as unknown as [Team[]];

            if (teamRows.length === 0) {
                return null;
            }

            const teamData = teamRows[0] as { id: string; name: string };

            const [counterRows] = await connection.execute(
                'SELECT id, memberName, steps FROM counters WHERE teamId = ?',
                [teamName],
            ) as unknown as [Counter[]];

            const counters: Counter[] = counterRows.map((row: any) => ({
                id: row.id,
                memberName: row.memberName,
                steps: row.steps,
            }));

            return {
                id: teamData.id,
                name: teamData.name,
                counters,
            };
        } finally {
            connection.release();
        }
    }

    public async save(team: Team): Promise<void> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            const [teamRows] = await connection.execute(
                'SELECT id FROM teams WHERE id = ?',
                [team.id],
            ) as unknown as [Team[]];

            if (teamRows.length > 0) {
                await connection.execute(
                    'UPDATE teams SET name = ? WHERE id = ?',
                    [team.name, team.id],
                );
            } else {

                await connection.execute(
                    'INSERT INTO teams (id, name) VALUES (?, ?)',
                    [team.id, team.name],
                );
            }

            await connection.execute(
                'DELETE FROM counters WHERE teamId = ?',
                [team.id],
            );

            for (const counter of team.counters) {
                await connection.execute(
                    'INSERT INTO counters (id, teamId, memberName, steps) VALUES (?, ?, ?, ?)',
                    [counter.id, team.id, counter.memberName, counter.steps],
                );
            }

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw new Error(`Failed to save team: ${err}`);
        } finally {
            connection.release();
        }
    }

    public async delete(id: string): Promise<void> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute(
                'DELETE FROM teams WHERE id = ?',
                [id],
            );

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw new Error(`Failed to delete team: ${err}`);
        } finally {
            connection.release();
        }
    }

    public async findAll(): Promise<Team[]> {
        const connection = await this.pool.getConnection();
        try {
            const [teamRows] = await connection.execute('SELECT id, name FROM teams');

            const teams: Team[] = [];

            for (const teamData of teamRows as { id: string; name: string }[]) {
                const [counterRows] = await connection.execute(
                    'SELECT id, memberName, steps FROM counters WHERE teamId = ?',
                    [teamData.id],
                ) as unknown as [Counter[]];

                const counters: Counter[] = counterRows.map((row: any) => ({
                    id: row.id,
                    memberName: row.memberName,
                    steps: row.steps,
                }));

                teams.push({
                    id: teamData.id,
                    name: teamData.name,
                    counters,
                });
            }

            return teams;
        } finally {
            connection.release();
        }
    }
}