import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ConsultaDbIAService } from './consulta-db-ia.service';
import { PreguntaDto } from './pregunta.dto';

@ApiTags('Consulta IA + Base de Datos')
@Controller('consulta-db')
export class ConsultaDbIAController {
  constructor(private readonly consultaDbIAService: ConsultaDbIAService) {}

  @Post()
  @ApiOperation({ summary: 'Analiza una pregunta y devuelve la respuesta basada en la base de datos' })
  @ApiBody({ type: PreguntaDto })
  @ApiResponse({ status: 201, description: 'Respuesta generada por IA basada en la base de datos.' })
  @ApiResponse({ status: 500, description: 'Error al procesar la consulta' })
  async analizarPregunta(@Body() body: PreguntaDto) {
    try {
      const resultado = await this.consultaDbIAService.procesarPregunta(body.fk_user, body.pregunta);
      return resultado;
    } catch (error) {
      throw new HttpException('Error procesando la pregunta', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
