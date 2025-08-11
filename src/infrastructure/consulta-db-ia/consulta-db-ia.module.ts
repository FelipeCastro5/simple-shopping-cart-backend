import { Module } from '@nestjs/common';
import { ConsultaDbIAService } from './consulta-db-ia.service';
import { ConsultaDbIAController } from './consulta-db-ia.controller';
import { PostgresService } from '../../infrastructure/postgres-db/postgres.service';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from '../gemini-ia/gemini.service';
import { HistorialRepository } from '../repository/historial.repository';

@Module({
  imports: [ConfigModule],
  controllers: [ConsultaDbIAController],
  providers: [ConsultaDbIAService, GeminiService, PostgresService, HistorialRepository],
})
export class ConsultaDbIAModule {}
