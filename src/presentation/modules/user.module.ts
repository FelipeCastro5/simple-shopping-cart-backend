import { Module } from '@nestjs/common';
import { CreateUserHandler } from '../../application/user/handlers/create-user.handler';
import { DeleteUserHandler } from '../../application/user/handlers/delete-user.handler';
import { GetAllUsersHandler } from '../../application/user/handlers/get-all-users.handler';
import { GetUserByIdHandler } from '../../application/user/handlers/get-user-by-id.handler';
import { UpdateUserHandler } from '../../application/user/handlers/update-user.handler';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { UsersController } from '../controllers/user.controller';
import { PostgresModule } from '../../infrastructure/postgres-db/postgres.module';

@Module({
  imports: [PostgresModule],
  providers: [
    {
      provide: 'UserInterface',
      useClass: UserRepository,
    },
    GetAllUsersHandler,
    GetUserByIdHandler,
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
