import { Inject, Injectable } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserInterface } from '../../../domain/user-domain/user.interface';
import { ResponseUtil } from '../../utilities/response.util';

@Injectable()
export class CreateUserHandler {
  constructor(
    @Inject('UserInterface')
    private readonly userRepository: UserInterface,
  ) {}

  async execute(command: CreateUserCommand) {
    try {
      const newUser = await this.userRepository.createUser(command.name, command.email);
      return ResponseUtil.success(newUser, 'Usuario creado exitosamente', 201);
    } catch (error) {
      console.error('Error en CreateUserHandler:', error);
      return ResponseUtil.error('Error al crear el usuario', 500);
    }
  }
}
