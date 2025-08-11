import { Inject, Injectable } from '@nestjs/common';
import { GetUserByIdCommand } from '../commands/get-user-by-id.command';
import { UserInterface } from '../../../domain/user-domain/user.interface';
import { ResponseUtil } from '../../utilities/response.util';

@Injectable()
export class GetUserByIdHandler {
  constructor(
    @Inject('UserInterface')
    private readonly userRepository: UserInterface,
  ) {}

  async execute(command: GetUserByIdCommand) {
    try {
      const user = await this.userRepository.getById(command.id);
      if (!user) {
        return ResponseUtil.error('Usuario no encontrado', 404);
      }
      return ResponseUtil.success(user, 'Usuario encontrado exitosamente.');
    } catch (error) {
      console.error('Error en GetUserByIdHandler:', error);
      return ResponseUtil.error('Error al obtener el usuario', 500);
    }
  }
}
