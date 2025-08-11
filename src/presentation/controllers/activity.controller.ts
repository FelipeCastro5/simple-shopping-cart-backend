import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs'; // 👈 nuevo

import { CreateActivityCommand } from '../../application/activity/commands/create-activity.command';
import { UpdateActivityCommand } from '../../application/activity/commands/update-activity.command';
import { DeleteActivityCommand } from '../../application/activity/commands/delete-activity.command';
import { GetAllActivitiesCommand } from '../../application/activity/commands/get-all-activities.command';
import { GetActivityByIdCommand } from '../../application/activity/commands/get-activity-by-id.command';

import { CreateActivityDto } from '../dtos/activity/create-activity.dto';
import { UpdateActivityDto } from '../dtos/activity/update-activity.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('getAll')
  @ApiOperation({ summary: 'Obtener todas las actividades' })
  @ApiResponse({ status: 200, description: 'Actividades obtenidas exitosamente' })
  async getAllActivities() {
    return this.queryBus.execute(new GetAllActivitiesCommand());
  }

  @Get('getById')
  @ApiOperation({ summary: 'Obtener actividad por ID' })
  @ApiResponse({ status: 200, description: 'Actividad encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async getActivityById(@Query('id') id: number) {
    return this.queryBus.execute(new GetActivityByIdCommand(id));
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva actividad' })
  @ApiResponse({ status: 201, description: 'Actividad creada exitosamente' })
  async createActivity(@Body() dto: CreateActivityDto) {
    const command = new CreateActivityCommand(dto.fk_user, dto.fk_proj, dto.activity);
    return this.commandBus.execute(command);
  }

  @Put('update')
  @ApiOperation({ summary: 'Actualizar una actividad existente' })
  @ApiResponse({ status: 200, description: 'Actividad actualizada exitosamente' })
  async updateActivity(@Body() dto: UpdateActivityDto) {
    const command = new UpdateActivityCommand(dto.id, dto.fk_user, dto.fk_proj, dto.activity);
    return this.commandBus.execute(command);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Eliminar una actividad por ID' })
  @ApiResponse({ status: 200, description: 'Actividad eliminada exitosamente' })
  async deleteActivity(@Query('id') id: number) {
    return this.commandBus.execute(new DeleteActivityCommand(id));
  }
}
