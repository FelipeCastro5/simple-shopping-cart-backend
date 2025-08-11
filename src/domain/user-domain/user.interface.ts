import { User } from './user.entity';

export interface UserInterface {
  getAll(): Promise<User[]>;
  getById(id: number): Promise<User | null>;
  createUser(name: string, email: string): Promise<User>;
  updateUser(id: number, name: string, email: string): Promise<any>;
  deleteUser(id: number): Promise<any>;
}
