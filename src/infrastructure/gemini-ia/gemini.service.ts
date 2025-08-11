import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async preguntarGemini(pregunta: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(pregunta);
      const response = await result.response;
      const texto = response.text();

      return texto;
    } catch (error) {
      console.error('❌ Error consultando Gemini:', error);
      throw new Error('Error procesando la consulta con Gemini');
    }
  }
}
