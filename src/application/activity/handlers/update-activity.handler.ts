import { Inject, Injectable } from '@nestjs/common';
import { UpdateActivityCommand } from '../commands/update-activity.command';
import { ActivityInterface } from '../../../domain/activity-domain/activity.interface';
import { ResponseUtil } from '../../utilities/response.util';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateActivityCommand)
export class UpdateActivityHandler implements ICommandHandler<UpdateActivityCommand> {
 constructor(
    @Inject('ActivityInterface')
    private readonly activityRepository: ActivityInterface,
  ) {}

  async execute(command: UpdateActivityCommand) {
    try {
      const result = await this.activityRepository.updateActivity(
        command.id,
        command.fk_user,
        command.fk_proj,
        command.activity,
      );

      if (!result?.rows?.length) {
        return ResponseUtil.error('Actividad no encontrada', 404);
      }

      return ResponseUtil.success(null, 'Actividad actualizada exitosamente.', 200);
    } catch (error: any) {
      console.error('Error inesperado en UpdateActivityHandler:', error);
      return ResponseUtil.error('Error al actualizar la actividad', 500);
    }
  }
}
