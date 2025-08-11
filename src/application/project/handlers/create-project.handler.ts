import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectCommand } from '../commands/create-project.command';
import { ProjectInterface } from '../../../domain/project-domain/project.interface';
import { ResponseUtil } from '../../utilities/response.util';
//import { SqlSanitizer } from '../../utilities/sql-sanitizer.util';

@Injectable()
export class CreateProjectHandler {
  constructor(
    @Inject('ProjectInterface')
    private readonly projectRepository: ProjectInterface,
  ) { }

  async execute(command: CreateProjectCommand) {
    // Validación dinámica
    // for (const [key, value] of Object.entries(command)) {
    //   const validation = SqlSanitizer.validate(value, key);
    //   if (validation) {
    //     return ResponseUtil.error(
    //       `Petición rechazada: entrada maliciosa detectada en el campo "${validation.field}"`,
    //       403,
    //     );
    //   }
    // }

    try {
      const newProject = await this.projectRepository.createProject(command.name, command.details);
      return ResponseUtil.success(newProject, 'Proyecto creado exitosamente', 201);
    } catch (error) {
      console.error('Error en CreateProjectHandler:', error);
      return ResponseUtil.error('Error al crear el proyecto', 500);
    }
  }
}
