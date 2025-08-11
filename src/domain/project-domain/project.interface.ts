import { Project } from './project.entity';

export interface ProjectInterface {
  getAll(): Promise<Project[]>;
  getById(id: number): Promise<Project | null>;
  createProject(name: string, details: string): Promise<Project>;
  updateProject(id: number, name: string, details: string): Promise<any>;
  deleteProject(id: number): Promise<any>;
}
