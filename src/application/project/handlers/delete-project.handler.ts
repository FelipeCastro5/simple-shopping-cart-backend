import { Inject, Injectable } from '@nestjs/common';
import { DeleteProjectCommand } from '../commands/delete-project.command';
import { ProjectInterface } from '../../../domain/project-domain/project.interface';
import { ResponseUtil } from '../../utilities/response.util';

@Injectable()
export class DeleteProjectHandler {
  constructor(
    @Inject('ProjectInterface')
    private readonly projectRepository: ProjectInterface,
  ) {}

  async execute(command: DeleteProjectCommand) {
    try {
      const result = await this.projectRepository.deleteProject(command.id);

      if (!result?.rows?.length) {
        return ResponseUtil.error('Proyecto no encontrado', 404);
      }

      return ResponseUtil.success(null, 'Proyecto eliminado exitosamente.', 200);
    } catch (error: any) {
      if (error.code === '23503') {
        return ResponseUtil.error(
          'No se puede eliminar el proyecto porque está relacionado con otra entidad.',
          409,
        );
      }

      console.error('Error inesperado en DeleteProjectHandler:', error);
      return ResponseUtil.error('Error al eliminar el proyecto', 500);
    }
  }
}
