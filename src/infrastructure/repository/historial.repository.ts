import { Injectable } from '@nestjs/common';
import { HistorialInterface } from '../../domain/historial-domain/historial.interface';
import { Historial } from '../../domain/historial-domain/historial.entity';
import { PostgresService } from '../postgres-db/postgres.service';

@Injectable()
export class HistorialRepository implements HistorialInterface {
  constructor(private readonly postgresService: PostgresService) { }

  async insertHistorial(fk_user: number, question: string, answer: string): Promise<Historial> {
    const query = this.postgresService.getQuery('insert-historial');
    const result = await this.postgresService.query<Historial>(query, [fk_user, question, answer]);
    return result.rows[0];
  }

  async getLastFive(): Promise<Historial[]> {
    const query = this.postgresService.getQuery('get-last-five-historial');
    const result = await this.postgresService.query<Historial>(query);
    return result.rows;
  }

  async getLastFiveByUser(fk_user: number): Promise<Historial[]> {
    const query = this.postgresService.getQuery('get-last-five-historial-by-user');
    const result = await this.postgresService.query<Historial>(query, [fk_user]);
    return result.rows;
  }

}
