import { Injectable } from '@nestjs/common';
import { ProjectInterface } from '../../domain/project-domain/project.interface';
import { Project } from '../../domain/project-domain/project.entity';
import { PostgresService } from '../postgres-db/postgres.service';

@Injectable()
export class ProjectRepository implements ProjectInterface {
  constructor(private readonly postgresService: PostgresService) { }

  async getAll(): Promise<Project[]> {
    const query = this.postgresService.getQuery('get-all-projects');
    const result = await this.postgresService.query<Project>(query);
    return result.rows;
  }

  async getById(id: number): Promise<Project | null> {
    const query = this.postgresService.getQuery('get-project-by-id');
    const result = await this.postgresService.query<Project>(query, [id]);
    return result.rows[0] || null;
  }

  async createProject(name: string, details: string): Promise<Project> {
    const query = this.postgresService.getQuery('insert-project');
    const result = await this.postgresService.query<Project>(query, [name, details]);
    return result.rows[0];
  }

  async updateProject(id: number, name: string, details: string): Promise<any> {
    const query = this.postgresService.getQuery('update-project');
    const result = await this.postgresService.query<any[]>(query, [name, details, id]);
    return result; // <- esta línea es esencial
  }

  async deleteProject(id: number): Promise<any> {
    const query = this.postgresService.getQuery('delete-project');
    const result = await this.postgresService.query<any[]>(query, [id]);
    return result; // <- esta línea es esencial
  }
}
