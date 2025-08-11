import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({ example: 1, description: 'ID del usuario a actualizar' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: number;

  @ApiProperty({ example: 'Juan Actualizado', description: 'Nuevo nombre del usuario', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'juan.actualizado@example.com', description: 'Nuevo correo electrónico', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
