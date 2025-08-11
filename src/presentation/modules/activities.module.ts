import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ActivityRepository } from '../../infrastructure/repository/activity.repository';
import { PostgresModule } from '../../infrastructure/postgres-db/postgres.module';
import { ActivitiesController } from '../controllers/activity.controller';
import { CreateActivityHandler } from '../../application/activity/handlers/create-activity.handler';
import { UpdateActivityHandler } from '../../application/activity/handlers/update-activity.handler';
import { DeleteActivityHandler } from '../../application/activity/handlers/delete-activity.handler';
import { GetAllActivitiesHandler } from '../../application/activity/handlers/get-all-activities.handler';
import { GetActivityByIdHandler } from '../../application/activity/handlers/get-activity-by-id.handler';
// Aquí podrías importar tus handlers y controller

@Module({
  imports: [PostgresModule, CqrsModule],
  providers: [
    {
      provide: 'ActivityInterface',
      useClass: ActivityRepository,
    },
    CreateActivityHandler,
    UpdateActivityHandler,
    DeleteActivityHandler,
    GetAllActivitiesHandler,
    GetActivityByIdHandler,
  ],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
