import { Inject, Injectable } from '@nestjs/common';
import { GetProjectByIdCommand } from '../commands/get-project-by-id.command';
import { ProjectInterface } from '../../../domain/project-domain/project.interface';
import { ResponseUtil } from '../../utilities/response.util';

@Injectable()
export class GetProjectByIdHandler {
  constructor(
    @Inject('ProjectInterface')
    private readonly projectRepository: ProjectInterface,
  ) {}

  async execute(command: GetProjectByIdCommand) {
    try {
      const project = await this.projectRepository.getById(command.id);
      if (!project) {
        return ResponseUtil.error('Proyecto no encontrado', 404);
      }
      return ResponseUtil.success(project, 'Proyecto encontrado exitosamente.');
    } catch (error) {
      console.error('Error en GetProjectByIdHandler:', error);
      return ResponseUtil.error('Error al obtener el proyecto', 500);
    }
  }
}
