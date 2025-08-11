import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateActivityCommand } from '../commands/create-activity.command';
import { Inject, Injectable } from '@nestjs/common';
import { ActivityInterface } from '../../../domain/activity-domain/activity.interface';
import { ResponseUtil } from '../../utilities/response.util';

@CommandHandler(CreateActivityCommand)
export class CreateActivityHandler implements ICommandHandler<CreateActivityCommand> {
  constructor(
    @Inject('ActivityInterface')
    private readonly activityRepository: ActivityInterface,
  ) { }

  async execute(command: CreateActivityCommand) {
    try {
      const newActivity = await this.activityRepository.createActivity(
        command.fk_user,
        command.fk_proj,
        command.activity,
      );
      return ResponseUtil.success(newActivity, 'Actividad creada exitosamente', 201);
    } catch (error) {
      console.error('Error en CreateActivityHandler:', error);
      return ResponseUtil.error('Error al crear la actividad', 500);
    }
  }
}
