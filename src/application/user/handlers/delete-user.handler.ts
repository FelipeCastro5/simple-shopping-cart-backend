import { Inject, Injectable } from '@nestjs/common';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { UserInterface } from '../../../domain/user-domain/user.interface';
import { ResponseUtil } from '../../utilities/response.util';

@Injectable()
export class DeleteUserHandler {
  constructor(
    @Inject('UserInterface')
    private readonly userRepository: UserInterface,
  ) {}

  async execute(command: DeleteUserCommand) {
    try {
      const result = await this.userRepository.deleteUser(command.id);

      if (!result?.rows?.length) {
        return ResponseUtil.error('Usuario no encontrado', 404);
      }

      return ResponseUtil.success(null, 'Usuario eliminado exitosamente.', 200);
    } catch (error: any) {
      if (error.code === '23503') {
        return ResponseUtil.error(
          'No se puede eliminar el usuario porque está relacionado con otra entidad.',
          409,
        );
      }

      console.error('Error inesperado en DeleteUserHandler:', error);
      return ResponseUtil.error('Error al eliminar el usuario', 500);
    }
  }
}
