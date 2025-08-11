import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini-ia/gemini.service';
import { PostgresService } from '../../infrastructure/postgres-db/postgres.service';
import { HistorialRepository } from '../repository/historial.repository';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class IaToolkitService {
  private readonly logger = new Logger(IaToolkitService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly postgresService: PostgresService,
    private readonly historialRepository: HistorialRepository,
  ) { }

  // 🔹 Obtener historial reciente
  public async obtenerHistorial(fk_user: number) {
    return await this.historialRepository.getLastFiveByUser(fk_user);
  }

  // 🔹 Generar prompt desde historial
  public generarPromptDesdeHistorial(historial: any[], pregunta: string): string {
    if (historial.length === 0) {
      return `El usuario pregunta: "${pregunta}". Responde de forma clara y en español.`;
    }

    const contexto = historial
      .map(item => `Usuario: ${item.question}\nIA: ${item.answer}`)
      .join('\n\n');

    return `${contexto}\n\nAhora el usuario pregunta: "${pregunta}"\nResponde de forma clara y en español con un límite de 400 a 500 caracteres.`;
  }

  // 🔹 Guardar en historial
  public async guardarPreguntaYRespuesta(fk_user: number, pregunta: string, respuesta: string) {
    await this.historialRepository.insertHistorial(fk_user, pregunta, respuesta.trim());
  }

  // 🔹 Generar SQL a partir de pregunta
  public async generarSQLDesdePregunta(preguntaUsuario: string): Promise<string> {
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

  // 🔹 Ejecutar SQL
  public async ejecutarSQL(sql: string): Promise<any[]> {
    const resultado = await this.postgresService.query(sql);
    return resultado.rows;
  }

  // 🔹 Generar respuesta final en lenguaje natural
  public async generarRespuestaEnLenguajeNatural(pregunta: string, datos: any[]): Promise<string> {
    const promptConclusion = `El usuario preguntó: "${pregunta}".
Los datos obtenidos de la base de datos son:

${JSON.stringify(datos)}

Redacta una respuesta clara en español explicando estos resultados.`;

    const respuesta = await this.geminiService.preguntarGemini(promptConclusion);
    return respuesta.trim();
  }

  // 🔹 Clasificar tipo de pregunta
  public async clasificarTipoDePregunta(pregunta: string): Promise<'sql' | 'historial' | 'mixto'> {
    const promptClasificacion = `Clasifica la siguiente pregunta en una de las siguientes categorías:
- "sql": si se refiere directamente a obtener datos de una base de datos.
- "historial": si es una conversación general que no requiere acceso a la base de datos.
- "mixto": si requiere tanto contexto conversacional como acceso a datos.

Pregunta: "${pregunta}"
Devuelve solo una palabra: sql, historial o mixto.`;

    const respuesta = await this.geminiService.preguntarGemini(promptClasificacion);
    const tipo = respuesta.trim().toLowerCase();

    this.logger.debug(`🧠 Clasificación de la pregunta: ${tipo}`);
    if (['sql', 'historial', 'mixto'].includes(tipo)) {
      return tipo as 'sql' | 'historial' | 'mixto';
    }

    this.logger.warn(`⚠️ Clasificación no reconocida: ${tipo}. Se usará 'historial' por defecto.`);
    return 'historial';
  }
}
