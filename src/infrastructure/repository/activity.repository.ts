import { Injectable } from '@nestjs/common';
import { ActivityInterface } from '../../domain/activity-domain/activity.interface';
import { Activity } from '../../domain/activity-domain/activity.entity';
import { PostgresService } from '../postgres-db/postgres.service';

@Injectable()
export class ActivityRepository implements ActivityInterface {
    constructor(private readonly postgresService: PostgresService) { }

    async getAll(): Promise<Activity[]> {
        const query = this.postgresService.getQuery('get-all-activities');
        const result = await this.postgresService.query<Activity>(query);
        return result.rows;
    }

    async getById(id: number): Promise<Activity | null> {
        const query = this.postgresService.getQuery('get-activity-by-id');
        const result = await this.postgresService.query<Activity>(query, [id]);
        return result.rows[0] || null;
    }

    async createActivity(fk_user: number | null, fk_proj: number, activity: string): Promise<Activity> {
        const query = this.postgresService.getQuery('insert-activity');
        const result = await this.postgresService.query<Activity>(query, [fk_user, fk_proj, activity]);
        return result.rows[0];
    }

    async updateActivity(id: number, fk_user: number | null, fk_proj: number, activity: string): Promise<any> {
        const query = this.postgresService.getQuery('update-activity');
        const result = await this.postgresService.query<any[]>(query, [fk_user, fk_proj, activity, id]);
        return result;
    }
    async deleteActivity(id: number): Promise<any> {
        const query = this.postgresService.getQuery('delete-activity');
        const result = await this.postgresService.query<any[]>(query, [id]);
        return result;
    }
}
