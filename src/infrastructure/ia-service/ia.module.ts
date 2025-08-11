import { Module } from "@nestjs/common";
import { GeminiService } from "../gemini-ia/gemini.service";
import { PostgresService } from "../postgres-db/postgres.service";
import { HistorialRepository } from "../repository/historial.repository";
import { IaToolkitService } from "./ia-toolkit.service";
import { ClasificacionHandler } from "./handlers/clasificar.handler";
import { MixtoHandler } from "./handlers/mixto.handler";
import { SqlHandler } from "./handlers/sql.handler";
import { HistoryHandler } from "./handlers/history.handler";
import { IaController } from "./ia.controller";
@Module({
  providers: [
    GeminiService,
    PostgresService,
    HistorialRepository,
    IaToolkitService,
    ClasificacionHandler,
    MixtoHandler,
    SqlHandler,
    HistoryHandler,
  ],
  controllers: [IaController],
})
export class iaModule {}
