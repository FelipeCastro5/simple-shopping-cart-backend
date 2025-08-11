import { Injectable, Logger } from '@nestjs/common';
import { IaToolkitService } from '../ia-toolkit.service';
import { HistoryHandler } from './history.handler';
import { SqlHandler } from './sql.handler';
import { MixtoHandler } from './mixto.handler';

@Injectable()
export class ClasificacionHandler {
  private readonly logger = new Logger(ClasificacionHandler.name);

  constructor(
    private readonly toolkit: IaToolkitService,
    private readonly historyHandler: HistoryHandler,
    private readonly sqlHandler: SqlHandler,
    private readonly mixtoHandler: MixtoHandler,
  ) {}

  async procesarPreguntaInteligente(fk_user: number, pregunta: string): Promise<any> {
    try {
      const tipo = await this.toolkit.clasificarTipoDePregunta(pregunta);
      this.logger.debug(`🤖 Tipo de flujo clasificado: ${tipo}`);

      if (tipo === 'historial') {
        const respuesta = await this.historyHandler.procesarChatSimple(fk_user, pregunta);
        return { tipo, respuesta };
      }

      if (tipo === 'sql') {
        const resultado = await this.sqlHandler.procesarConsultaDb(fk_user, pregunta);
        return { tipo, ...resultado };
      }

      if (tipo === 'mixto') {
        const resultado = await this.mixtoHandler.procesarFlujoMixto(fk_user, pregunta);
        return { tipo, ...resultado };
      }

      this.logger.warn(`⚠️ Tipo de flujo desconocido: ${tipo}. Ejecutando como historial por defecto.`);
      const respuesta = await this.historyHandler.procesarChatSimple(fk_user, pregunta);
      return { tipo: 'historial', respuesta };
    } catch (error) {
      this.logger.error('❌ Error en procesarPreguntaInteligente', error);
      throw new Error('Ocurrió un error al procesar la pregunta con IA.');
    }
  }
}
