import { Injectable } from '@nestjs/common';
import { UserInterface } from '../../domain/user-domain/user.interface';
import { User } from '../../domain/user-domain/user.entity';
import { PostgresService } from '../postgres-db/postgres.service';

@Injectable()
export class UserRepository implements UserInterface {
  constructor(private readonly postgresService: PostgresService) {}

  async getAll(): Promise<User[]> {
    const query = this.postgresService.getQuery('get-all-users');
    const result = await this.postgresService.query<User>(query);
    return result.rows;
  }

  async getById(id: number): Promise<User | null> {
    const query = this.postgresService.getQuery('get-user-by-id');
    const result = await this.postgresService.query<User>(query, [id]);
    return result.rows[0] || null;
  }

  async createUser(name: string, email: string): Promise<User> {
    const query = this.postgresService.getQuery('insert-user');
    const result = await this.postgresService.query<User>(query, [name, email]);
    return result.rows[0];
  }

  async updateUser(id: number, name: string, email: string): Promise<any> {
    const query = this.postgresService.getQuery('update-user');
    const result = await this.postgresService.query<any[]>(query, [name, email, id]);
    return result;
  }

  async deleteUser(id: number): Promise<any> {
    const query = this.postgresService.getQuery('delete-user');
    const result = await this.postgresService.query<any[]>(query, [id]);
    return result;
  }
}
