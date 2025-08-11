import { Activity } from './activity.entity';

export interface ActivityInterface {
  getAll(): Promise<Activity[]>;
  getById(id: number): Promise<Activity | null>;
  createActivity(fk_user: number | null, fk_proj: number, activity: string): Promise<Activity>;
  updateActivity(id: number, fk_user: number | null, fk_proj: number, activity: string): Promise<any>;
  deleteActivity(id: number): Promise<any>;
}
