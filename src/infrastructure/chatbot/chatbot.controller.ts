import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChatbotPreguntaDto, ChatbotRespuestaDto } from './chatbot.dto';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
    constructor(private readonly chatbotService: ChatbotService) { }

    @Post()
    @ApiOperation({ summary: 'Enviar pregunta al chatbot con historial de contexto' })
    @ApiBody({ type: ChatbotPreguntaDto })
    @ApiResponse({ status: 201, description: 'Respuesta generada por Gemini', type: ChatbotRespuestaDto })
    async conversar(
        @Body() body: ChatbotPreguntaDto,
    ): Promise<ChatbotRespuestaDto> {
        const { fk_user, pregunta } = body;
        console.log('➡️ Body recibido:', body);
        const respuesta = await this.chatbotService.procesarPregunta(fk_user, pregunta);
        return { respuesta };
    }
}
