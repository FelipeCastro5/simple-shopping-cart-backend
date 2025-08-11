import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UserInterface } from '../../../domain/user-domain/user.interface';
import { ResponseUtil } from '../../utilities/response.util';

@Injectable()
export class UpdateUserHandler {
  constructor(
    @Inject('UserInterface')
    private readonly userRepository: UserInterface,
  ) {}

  async execute(command: UpdateUserCommand) {
    try {
      const result = await this.userRepository.updateUser(command.id, command.name, command.email);

      if (!result?.rows?.length) {
        return ResponseUtil.error('Usuario no encontrado', 404);
      }

      return ResponseUtil.success(null, 'Usuario actualizado exitosamente.', 200);
    } catch (error: any) {
      console.error('Error inesperado en UpdateUserHandler:', error);
      return ResponseUtil.error('Error al actualizar el usuario', 500);
    }
  }
}
