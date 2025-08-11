import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateActivityDto {
  @ApiProperty({ example: 10, description: 'ID de la actividad a actualizar' })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 2, description: 'Nuevo ID del usuario (nullable)' })
  @IsOptional()
  @IsInt()
  fk_user: number | null;

  @ApiProperty({ example: 7, description: 'Nuevo ID del proyecto' })
  @IsInt()
  @Min(1)
  fk_proj: number;

  @ApiProperty({ example: 'Actualizar documentación', description: 'Nueva descripción de la actividad' })
  @IsString()
  activity: string;
}
