import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../../infrastructure/postgres-db/postgres.service';
import * as fs from 'fs';
import * as path from 'path';
import { GeminiService } from '../gemini-ia/gemini.service';
import { HistorialRepository } from '../repository/historial.repository';

@Injectable()
export class ConsultaDbIAService {
  private readonly logger = new Logger(ConsultaDbIAService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly postgresService: PostgresService,
    private readonly historialRepository: HistorialRepository,
  ) { }

  private async generarSQLDesdePregunta(preguntaUsuario: string): Promise<string> {
    const esquemaPath = path.join(process.cwd(), 'src', 'infrastructure', 'utilities', 'db.sql');
    const estructuraSQL = fs.readFileSync(esquemaPath, 'utf8');

    const promptSQL = `Tienes la siguiente estructura de base de datos:

${estructuraSQL}

Genera una consulta SQL para responder esta pregunta del usuario: "${preguntaUsuario}"
Cuando compares columnas de texto con valores proporcionados por el usuario, utiliza siempre ILIKE (insensible a mayúsculas) y asegúrate de permitir coincidencias parciales utilizando comodines % cuando sea apropiado.
Devuelve solo la consulta SQL, sin explicaciones ni comentarios.`;

    const sqlGeneradoRaw = await this.geminiService.preguntarGemini(promptSQL);
    const sqlLimpio = sqlGeneradoRaw.replace(/```sql|```/g, '').trim();

    this.logger.debug(`🔍 SQL generado:\n${sqlLimpio}`);

    return sqlLimpio;
  }

  private async ejecutarSQL(sql: string): Promise<any[]> {
    const resultado = await this.postgresService.query(sql);
    return resultado.rows;
  }

  private async generarRespuestaEnLenguajeNatural(pregunta: string, datos: any[]): Promise<string> {
    const promptConclusion = `El usuario preguntó: "${pregunta}".
Los datos obtenidos de la base de datos son:

${JSON.stringify(datos)}

Redacta una respuesta clara en español explicando estos resultados.`;

    const respuesta = await this.geminiService.preguntarGemini(promptConclusion);
    return respuesta.trim();
  }

  async procesarPregunta(fk_user: number, preguntaUsuario: string): Promise<{
    sql: string;
    datos: any;
    respuesta: string;
  }> {
    try {
      const sql = await this.generarSQLDesdePregunta(preguntaUsuario);
      const datos = await this.ejecutarSQL(sql);
      const respuesta = await this.generarRespuestaEnLenguajeNatural(preguntaUsuario, datos);
      await this.historialRepository.insertHistorial(fk_user, preguntaUsuario, respuesta.trim());
      
      return { sql, datos, respuesta };
    } catch (error) {
      this.logger.error('❌ Error procesando consulta IA + DB', error);
      throw new Error('Error al procesar la consulta con IA y base de datos');
    }
  }
}
