import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserCommand } from '../../application/user/commands/create-user.command';
import { DeleteUserCommand } from '../../application/user/commands/delete-user.command';
import { GetAllUsersCommand } from '../../application/user/commands/get-all-users.command';
import { GetUserByIdCommand } from '../../application/user/commands/get-user-by-id.command';
import { UpdateUserCommand } from '../../application/user/commands/update-user.command';

import { CreateUserHandler } from '../../application/user/handlers/create-user.handler';
import { DeleteUserHandler } from '../../application/user/handlers/delete-user.handler';
import { GetAllUsersHandler } from '../../application/user/handlers/get-all-users.handler';
import { GetUserByIdHandler } from '../../application/user/handlers/get-user-by-id.handler';
import { UpdateUserHandler } from '../../application/user/handlers/update-user.handler';

import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { CreateUserDto } from '../dtos/user/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly getAllHandler: GetAllUsersHandler,
    private readonly getByIdHandler: GetUserByIdHandler,
    private readonly createHandler: CreateUserHandler,
    private readonly updateHandler: UpdateUserHandler,
    private readonly deleteHandler: DeleteUserHandler,
  ) {}

  @Get('getAll')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente' })
  async getAllUsers() {
    return this.getAllHandler.execute(new GetAllUsersCommand());
  }

  @Get('getById')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserById(@Query('id') id: number) {
    return this.getByIdHandler.execute(new GetUserByIdCommand(id));
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { name, email } = createUserDto;
    return this.createHandler.execute(new CreateUserCommand(name, email));
  }

  @Put('update')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const { id, name, email } = updateUserDto;
    return this.updateHandler.execute(new UpdateUserCommand(id, name, email));
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  async deleteUser(@Query('id') id: number) {
    return this.deleteHandler.execute(new DeleteUserCommand(id));
  }
}
