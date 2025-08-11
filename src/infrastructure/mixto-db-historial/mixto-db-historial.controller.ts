import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MixtoDbHistorialService } from './mixto-db-historial.service';
import { ChatbotPreguntaDto, ChatbotRespuestaDto } from '../chatbot/chatbot.dto';
import { PreguntaDto } from '../consulta-db-ia/pregunta.dto';
@ApiTags('IA - DB + Historial')
@Controller('ia-mixta')
export class MixtoDbHistorialController {
  constructor(private readonly mixtoService: MixtoDbHistorialService) { }

  @Post('chat')
  @ApiOperation({ summary: 'Realiza una pregunta con historial de conversación' })
  @ApiResponse({ status: 200, description: 'Respuesta generada por la IA', type: ChatbotRespuestaDto })
  async procesarChatSimple(@Body() body: ChatbotPreguntaDto): Promise<ChatbotRespuestaDto> {
    const respuesta = await this.mixtoService.procesarChatSimple(body.fk_user, body.pregunta);
    return { respuesta };
  }

  @Post('sql')
  @ApiOperation({ summary: 'Pregunta que se transforma en SQL y se consulta en la base de datos' })
  @ApiResponse({
    status: 200,
    description: 'Incluye la consulta SQL generada, los datos obtenidos y una respuesta explicativa.',
    schema: {
      example: {
        sql: 'SELECT * FROM proyectos WHERE responsable ILIKE \'%Loan Palomera%\';',
        datos: [{ id: 3, nombre: 'Proyecto X', responsable: 'Loan Palomera' }],
        respuesta: 'El proyecto de Loan Palomera es "Proyecto X".',
      },
    },
  })
  async procesarConsultaDb(@Body() body: PreguntaDto): Promise<{ sql: string; datos: any; respuesta: string; }> {
    return await this.mixtoService.procesarConsultaDb(body.fk_user, body.pregunta);
  }

  @Post('mixto')
  @ApiOperation({ summary: 'Flujo mixto: historial + IA + base de datos' })
  @ApiResponse({
    status: 200,
    description: 'Procesa una pregunta que requiere contexto del historial y acceso a base de datos.',
    schema: {
      example: {
        sql: 'SELECT * FROM tareas WHERE estado ILIKE \'%pendiente%\' AND responsable ILIKE \'%Luis%\';',
        datos: [
          { id: 12, titulo: 'Enviar informe', estado: 'pendiente', responsable: 'Luis' },
          { id: 15, titulo: 'Revisión de presupuesto', estado: 'pendiente', responsable: 'Luis' }
        ],
        respuesta: 'Luis tiene 2 tareas pendientes: "Enviar informe" y "Revisión de presupuesto".',
      },
    },
  })
  async procesarFlujoMixto(@Body() body: PreguntaDto): Promise<{
    sql: string;
    datos: any;
    respuesta: string;
  }> {
    return await this.mixtoService['procesarFlujoMixto'](body.fk_user, body.pregunta); // 👈 llamado directo al método privado
  }
}
