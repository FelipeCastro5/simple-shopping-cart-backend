import { Injectable, Logger } from '@nestjs/common';
import { IaToolkitService } from '../ia-toolkit.service';

@Injectable()
export class HistoryHandler {
  private readonly logger = new Logger(HistoryHandler.name);

  constructor(private readonly toolkit: IaToolkitService) {}

  async procesarChatSimple(fk_user: number, nuevaPregunta: string): Promise<string> {
    const historial = await this.toolkit.obtenerHistorial(fk_user);
    const contexto = this.toolkit.generarPromptDesdeHistorial(historial, nuevaPregunta);
    this.logger.debug('🧠 Prompt enviado a Gemini:\n' + contexto);
    const respuesta = await this.toolkit['geminiService'].preguntarGemini(contexto);
    await this.toolkit.guardarPreguntaYRespuesta(fk_user, nuevaPregunta, respuesta);
    return respuesta;
  }
}
