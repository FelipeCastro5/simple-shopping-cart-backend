import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { GeminiService } from './gemini.service';

@ApiTags('Gemini')
@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('ask')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pregunta: { type: 'string', example: '¿Qué es la inteligencia artificial?' },
      },
    },
  })
  async preguntar(@Body('pregunta') pregunta: string) {
    const respuesta = await this.geminiService.preguntarGemini(pregunta);
    return { pregunta, respuesta };
  }
}
