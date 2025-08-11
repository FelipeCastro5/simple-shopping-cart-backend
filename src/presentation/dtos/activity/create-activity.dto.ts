import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ example: 1, description: 'ID del usuario asignado (nullable)' })
  @IsOptional()
  @IsInt()
  fk_user: number | null;

  @ApiProperty({ example: 5, description: 'ID del proyecto relacionado' })
  @IsInt()
  @Min(1)
  fk_proj: number;

  @ApiProperty({ example: 'Diseñar prototipo', description: 'Descripción de la actividad' })
  @IsString()
  activity: string;
}
