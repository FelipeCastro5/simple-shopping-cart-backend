import { Module } from "@nestjs/common";
import { GeminiService } from "../gemini-ia/gemini.service";
import { PostgresService } from "../postgres-db/postgres.service";
import { HistorialRepository } from "../repository/historial.repository";
import { MixtoDbHistorialService } from "./mixto-db-historial.service";
import { MixtoDbHistorialController } from "./mixto-db-historial.controller";

@Module({
  providers: [
    GeminiService,
    PostgresService,
    HistorialRepository,
    MixtoDbHistorialService,
  ],
  controllers: [MixtoDbHistorialController],
})
export class MixtoModule {}
