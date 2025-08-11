import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateProjectCommand } from '../../application/project/commands/create-project.command';
import { DeleteProjectCommand } from '../../application/project/commands/delete-project.command';
import { GetAllProjectsCommand } from '../../application/project/commands/get-all-projects.command';
import { GetProjectByIdCommand } from '../../application/project/commands/get-project-by-id.command';
import { UpdateProjectCommand } from '../../application/project/commands/update-project.command';

import { CreateProjectHandler } from '../../application/project/handlers/create-project.handler';
import { DeleteProjectHandler } from '../../application/project/handlers/delete-project.handler';
import { GetAllProjectsHandler } from '../../application/project/handlers/get-all-projects.handler';
import { GetProjectByIdHandler } from '../../application/project/handlers/get-project-by-id.handler';
import { UpdateProjectHandler } from '../../application/project/handlers/update-project.handler';

import { CreateProjectDto } from '../dtos/project/create-project.dto';
import { UpdateProjectDto } from '../dtos/project/update-project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly getAllHandler: GetAllProjectsHandler,
    private readonly getByIdHandler: GetProjectByIdHandler,
    private readonly createHandler: CreateProjectHandler,
    private readonly updateHandler: UpdateProjectHandler,
    private readonly deleteHandler: DeleteProjectHandler,
  ) {}

  @Get('getAll')
  @ApiOperation({ summary: 'Obtener todos los proyectos' })
  @ApiResponse({ status: 200, description: 'Proyectos obtenidos exitosamente' })
  async getAllProjects() {
    return this.getAllHandler.execute(new GetAllProjectsCommand());
  }

  @Get('getById')
  @ApiOperation({ summary: 'Obtener proyecto por ID' })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  async getProjectById(@Query('id') id: number) {
    return this.getByIdHandler.execute(new GetProjectByIdCommand(id));
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    const { name, details } = createProjectDto;
    return this.createHandler.execute(new CreateProjectCommand(name, details));
  }

  @Put('update')
  @ApiOperation({ summary: 'Actualizar un proyecto existente' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado exitosamente' })
  async updateProject(@Body() updateProjectDto: UpdateProjectDto) {
    const { id, name, details } = updateProjectDto;
    return this.updateHandler.execute(new UpdateProjectCommand(id, name, details));
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Eliminar un proyecto por ID' })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado exitosamente' })
  async deleteProject(@Query('id') id: number) {
    return this.deleteHandler.execute(new DeleteProjectCommand(id));
  }
}
