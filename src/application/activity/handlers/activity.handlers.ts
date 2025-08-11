import { CreateActivityHandler } from './create-activity.handler';
import { UpdateActivityHandler } from './update-activity.handler';
import { DeleteActivityHandler } from './delete-activity.handler';
import { GetAllActivitiesHandler } from './get-all-activities.handler';
import { GetActivityByIdHandler } from './get-activity-by-id.handler';

export const ActivityCommandHandlers = [
  CreateActivityHandler,
  UpdateActivityHandler,
  DeleteActivityHandler,
];

export const ActivityQueryHandlers = [
  GetAllActivitiesHandler,
  GetActivityByIdHandler,
];
