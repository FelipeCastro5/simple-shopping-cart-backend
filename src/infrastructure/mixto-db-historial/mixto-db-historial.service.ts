import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini-ia/gemini.service';
import { PostgresService } from '../../infrastructure/postgres-db/postgres.service';
import { HistorialRepository } from '../repository/historial.repository';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MixtoDbHistorialService {
  private readonly logger = new Logger(MixtoDbHistorialService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly postgresService: PostgresService,
    private readonly historialRepository: HistorialRepository,
  ) { }

  // ✅ Chat con historial (simple)
  async procesarChatSimple(fk_user: number, nuevaPregunta: string): Promise<string> {
    const historial = await this.obtenerHistorial(fk_user);
    const contexto = this.generarPromptDesdeHistorial(historial, nuevaPregunta);
    this.logger.debug('🧠 Prompt enviado a Gemini:\n' + contexto);
    const respuesta = await this.geminiService.preguntarGemini(contexto);
    await this.guardarPreguntaYRespuesta(fk_user, nuevaPregunta, respuesta);
    return respuesta;
  }

  // ✅ Consulta SQL + respuesta natural
  async procesarConsultaDb(fk_user: number, preguntaUsuario: string): Promise<{ sql: string; datos: any; respuesta: string; }> {
    try {
      const sql = await this.generarSQLDesdePregunta(preguntaUsuario);
      const datos = await this.ejecutarSQL(sql);
      const respuesta = await this.generarRespuestaEnLenguajeNatural(preguntaUsuario, datos);
      await this.guardarPreguntaYRespuesta(fk_user, preguntaUsuario, respuesta);
      return { sql, datos, respuesta };
    } catch (error) {
      this.logger.error('❌ Error procesando consulta IA + DB', error);
      throw new Error('Error al procesar la consulta con IA y base de datos');
    }
  }

  // 🔹 Obtener historial reciente
  private async obtenerHistorial(fk_user: number) {
    return await this.historialRepository.getLastFiveByUser(fk_user);
  }

  // 🔹 Generar prompt desde historial
  private generarPromptDesdeHistorial(historial: any[], pregunta: string): string {
    if (historial.length === 0) {
      return `El usuario pregunta: "${pregunta}". Responde de forma clara y en español.`;
    }

    const contexto = historial
      .map(item => `Usuario: ${item.question}\nIA: ${item.answer}`)
      .join('\n\n');

    return `${contexto}\n\nAhora el usuario pregunta: "${pregunta}"\nResponde de forma clara y en español con un límite de 400 a 500 caracteres.`;
  }

  // 🔹 Guardar en historial
  private async guardarPreguntaYRespuesta(fk_user: number, pregunta: string, respuesta: string) {
    await this.historialRepository.insertHistorial(fk_user, pregunta, respuesta.trim());
  }

  // 🔹 Generar SQL a partir de pregunta
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

  // 🔹 Ejecutar SQL
  private async ejecutarSQL(sql: string): Promise<any[]> {
    const resultado = await this.postgresService.query(sql);
    return resultado.rows;
  }

  // 🔹 Generar respuesta final en lenguaje natural
  private async generarRespuestaEnLenguajeNatural(pregunta: string, datos: any[]): Promise<string> {
    const promptConclusion = `El usuario preguntó: "${pregunta}".
Los datos obtenidos de la base de datos son:

${JSON.stringify(datos)}

Redacta una respuesta clara en español explicando estos resultados.`;

    const respuesta = await this.geminiService.preguntarGemini(promptConclusion);
    return respuesta.trim();
  }

  // 🔍 Clasificar tipo de pregunta: historial, sql o mixto
  private async clasificarTipoDePregunta(pregunta: string): Promise<'historial' | 'sql' | 'mixto'> {
    const promptClasificacion = `
    Analiza la siguiente pregunta del usuario y responde solo con una de las siguientes palabras: 
    - "historial" si se trata de una conversación general o pregunta abierta.
    - "sql" si la pregunta requiere una consulta a base de datos estructurada.
    - "mixto" si combina ambos enfoques (necesita contexto del historial + datos de la base de datos).

    Pregunta del usuario: "${pregunta}"

    Responde solo con: historial, sql o mixto. Sin explicaciones.
    `;

    const respuesta = await this.geminiService.preguntarGemini(promptClasificacion);
    const tipo = respuesta.trim().toLowerCase();

    if (['historial', 'sql', 'mixto'].includes(tipo)) {
      return tipo as 'historial' | 'sql' | 'mixto';
    }

    this.logger.warn(`⚠️ Clasificación inesperada de Gemini: "${tipo}". Se asumirá historial.`);
    return 'historial';
  }


  // 🔓 Método principal inteligente que decide qué flujo ejecutar
  async procesarPreguntaInteligente(fk_user: number, pregunta: string): Promise<any> {
    try {
      const tipo = await this.clasificarTipoDePregunta(pregunta);
      this.logger.debug(`🤖 Tipo de flujo clasificado: ${tipo}`);

      if (tipo === 'historial') {
        const respuesta = await this.procesarChatSimple(fk_user, pregunta);
        return { tipo, respuesta };
      }

      if (tipo === 'sql') {
        const resultado = await this.procesarConsultaDb(fk_user, pregunta);
        return { tipo, ...resultado };
      }

      if (tipo === 'mixto') {
        const resultado = await this.procesarFlujoMixto(fk_user, pregunta);
        return { tipo, ...resultado };
      } else {
        this.logger.warn(`⚠️ Tipo de flujo desconocido: ${tipo}. Ejecutando como historial por defecto.`);
        const respuesta = await this.procesarChatSimple(fk_user, pregunta);
        return { tipo: 'historial', respuesta };
      }

    } catch (error) {
      this.logger.error('❌ Error en procesarPreguntaInteligente', error);
      throw new Error('Ocurrió un error al procesar la pregunta con IA.');
    }
  }

  private async procesarFlujoMixto(fk_user: number, pregunta: string) {
    try {
      // 🔁 Flujo mixto: historial + SQL + respuesta natural
      const historial = await this.obtenerHistorial(fk_user);

      const contexto = historial
        .map(item => `Usuario: ${item.question}\nIA: ${item.answer}`)
        .join('\n\n');

      const promptSQL = `Tienes el siguiente contexto de conversación con el usuario:

${contexto}

Y el usuario ahora pregunta: "${pregunta}"

Con base en esto, genera una consulta SQL que permita responder correctamente.
Utiliza ILIKE para búsquedas insensibles a mayúsculas y comodines % para coincidencias parciales.

Devuelve solo la consulta SQL sin comentarios ni explicaciones.`;

      const sqlRaw = await this.geminiService.preguntarGemini(promptSQL);
      const sql = sqlRaw.replace(/```sql|```/g, '').trim();

      this.logger.debug(`📌 SQL generado desde flujo mixto:\n${sql}`);

      const datos = await this.ejecutarSQL(sql);
      const respuesta = await this.generarRespuestaEnLenguajeNatural(pregunta, datos);

      await this.guardarPreguntaYRespuesta(fk_user, pregunta, respuesta);

      return { sql, datos, respuesta };

    } catch (error) {
      this.logger.error('❌ Error en procesarPreguntaInteligente', error);
      throw new Error('Ocurrió un error al procesar la pregunta con IA.');
    }
  }


}
