import { Injectable, Logger } from '@nestjs/common';
import { Historial } from '../../domain/historial-domain/historial.entity';
import { GeminiService } from '../gemini-ia/gemini.service';
import { HistorialRepository } from '../repository/historial.repository';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly historialRepository: HistorialRepository,
  ) {}

  // 👉 Función pública principal
  async procesarPregunta(fk_user: number, nuevaPregunta: string): Promise<string> {
    const historial = await this.obtenerHistorial(fk_user);
    const contexto = this.generarPromptDesdeHistorial(historial, nuevaPregunta);
    this.logger.debug('🧠 Prompt enviado a Gemini:\n' + contexto);
    const respuesta = await this.generarRespuestaDesdeGemini(contexto);
    await this.guardarPreguntaYRespuesta(fk_user, nuevaPregunta, respuesta);
    return respuesta;
  }

  // 🔹 1. Obtener historial reciente
  private async obtenerHistorial(fk_user: number): Promise<Historial[]> {
    return await this.historialRepository.getLastFiveByUser(fk_user);
  }

  // 🔹 2. Generar prompt a partir del historial
  private generarPromptDesdeHistorial(historial: Historial[], pregunta: string): string {
    if (historial.length === 0) {
      return `El usuario pregunta: "${pregunta}". Responde de forma clara y en español.`;
    }

    const contexto = historial
      .map(item => `Usuario: ${item.question}\nIA: ${item.answer}`)
      .join('\n\n');
    return `${contexto}\n\nAhora el usuario pregunta: "${pregunta}"\nResponde de forma clara y en español con un límite de 400 a 500 caracteres.`;
  }

  // 🔹 3. Consultar a Gemini
  private async generarRespuestaDesdeGemini(prompt: string): Promise<string> {
    return await this.geminiService.preguntarGemini(prompt);
  }

  // 🔹 4. Guardar en historial
  private async guardarPreguntaYRespuesta(fk_user: number, pregunta: string, respuesta: string): Promise<void> {
    await this.historialRepository.insertHistorial(fk_user, pregunta, respuesta);
  }
}
