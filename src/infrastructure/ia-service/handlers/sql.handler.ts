import { Injectable, Logger } from '@nestjs/common';
import { IaToolkitService } from '../ia-toolkit.service';

@Injectable()
export class SqlHandler {
  private readonly logger = new Logger(SqlHandler.name);

  constructor(private readonly toolkit: IaToolkitService) {}

  async procesarConsultaDb(fk_user: number, preguntaUsuario: string): Promise<{ sql: string; datos: any; respuesta: string }> {
    try {
      const sql = await this.toolkit.generarSQLDesdePregunta(preguntaUsuario);
      const datos = await this.toolkit.ejecutarSQL(sql);
      const respuesta = await this.toolkit.generarRespuestaEnLenguajeNatural(preguntaUsuario, datos);
      await this.toolkit.guardarPreguntaYRespuesta(fk_user, preguntaUsuario, respuesta);
      return { sql, datos, respuesta };
    } catch (error) {
      this.logger.error('❌ Error procesando consulta IA + DB', error);
      throw new Error('Error al procesar la consulta con IA y base de datos');
    }
  }
}
