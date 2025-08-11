import { Inject, Injectable } from '@nestjs/common';
import { GetAllProjectsCommand } from '../commands/get-all-projects.command';
import { ProjectInterface } from '../../../domain/project-domain/project.interface';
import { ResponseUtil } from '../../utilities/response.util';

@Injectable()
export class GetAllProjectsHandler {
  constructor(
    @Inject('ProjectInterface')
    private readonly projectRepository: ProjectInterface,
  ) {}

  async execute(command: GetAllProjectsCommand) {
    try {
      const projects = await this.projectRepository.getAll();
      return ResponseUtil.success(projects, 'Proyectos obtenidos exitosamente.');
    } catch (error) {
      console.error(`Error en GetAllProjectsHandler: ${error}`);
      return ResponseUtil.error('Error al obtener los proyectos', 500);
    }
  }
}
