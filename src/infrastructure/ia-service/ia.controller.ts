import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClasificacionHandler } from './handlers/clasificar.handler';
import { HistoryHandler } from './handlers/history.handler';
import { SqlHandler } from './handlers/sql.handler';
import { MixtoHandler } from './handlers/mixto.handler';

@ApiTags('IA Toolkit')
@Controller('ia')
export class IaController {
  constructor(
    private readonly clasificacionHandler: ClasificacionHandler,
    private readonly historyHandler: HistoryHandler,
    private readonly sqlHandler: SqlHandler,
    private readonly mixtoHandler: MixtoHandler,
  ) {}

  @Get('historial')
  @ApiOperation({ summary: 'Pregunta basada solo en historial de conversación' })
  @ApiQuery({ name: 'fk_user', required: true, type: Number })
  @ApiQuery({ name: 'pregunta', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Respuesta generada a partir del historial del usuario.',
    schema: {
      example: {
        respuesta: 'Claro, la solicitud fue enviada el 3 de mayo de 2024.',
      },
    },
  })
  async chatHistorial(
    @Query('fk_user') fk_user: number,
    @Query('pregunta') pregunta: string,
  ): Promise<{ respuesta: string }> {
    const respuesta = await this.historyHandler.procesarChatSimple(fk_user, pregunta);
    return { respuesta };
  }

  @Get('sql')
  @ApiOperation({ summary: 'Pregunta transformada en SQL y consultada en la base de datos' })
  @ApiQuery({ name: 'fk_user', required: true, type: Number })
  @ApiQuery({ name: 'pregunta', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Consulta SQL generada, datos devueltos y respuesta explicativa.',
    schema: {
      example: {
        sql: "SELECT * FROM usuarios WHERE nombre ILIKE '%Ana%';",
        datos: [{ id: 1, nombre: 'Ana Pérez' }],
        respuesta: 'Se encontró un usuario llamado Ana Pérez.',
      },
    },
  })
  async consultaSql(
    @Query('fk_user') fk_user: number,
    @Query('pregunta') pregunta: string,
  ): Promise<{ sql: string; datos: any; respuesta: string }> {
    return await this.sqlHandler.procesarConsultaDb(fk_user, pregunta);
  }

  @Get('mixto')
  @ApiOperation({ summary: 'Flujo mixto: historial + IA + base de datos' })
  @ApiQuery({ name: 'fk_user', required: true, type: Number })
  @ApiQuery({ name: 'pregunta', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Combina contexto del historial y consulta a la base de datos.',
    schema: {
      example: {
        sql: "SELECT * FROM tareas WHERE estado ILIKE '%pendiente%' AND responsable ILIKE '%Luis%';",
        datos: [
          { id: 12, titulo: 'Enviar informe', estado: 'pendiente', responsable: 'Luis' },
        ],
        respuesta: 'Luis tiene una tarea pendiente: "Enviar informe".',
      },
    },
  })
  async mixto(
    @Query('fk_user') fk_user: number,
    @Query('pregunta') pregunta: string,
  ): Promise<{ sql: string; datos: any; respuesta: string }> {
    return await this.mixtoHandler.procesarFlujoMixto(fk_user, pregunta);
  }

  @Get('inteligente')
  @ApiOperation({ summary: 'Flujo inteligente: IA decide si usar historial, SQL o mixto' })
  @ApiQuery({ name: 'fk_user', required: true, type: Number })
  @ApiQuery({ name: 'pregunta', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'El sistema decide automáticamente cómo procesar la pregunta.',
    schema: {
      example: {
        tipo: 'mixto',
        sql: 'SELECT * FROM proyectos WHERE estado ILIKE \'%activo%\'',
        datos: [{ id: 1, nombre: 'Proyecto A', estado: 'activo' }],
        respuesta: 'Proyecto A está actualmente activo.',
      },
    },
  })
  async clasificacionInteligente(
    @Query('fk_user') fk_user: number,
    @Query('pregunta') pregunta: string,
  ): Promise<any> {
    return await this.clasificacionHandler.procesarPreguntaInteligente(fk_user, pregunta);
  }
}
