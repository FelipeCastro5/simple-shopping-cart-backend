import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class MixtoDbHistorialDto {
  @ApiProperty({
    description: 'ID del usuario que hace la pregunta',
    example: 42,
  })
  @IsInt()
  @Min(1)
  fk_user: number;

  @ApiProperty({
    description: 'Pregunta del usuario que requiere comparación con historial y DB',
    example: '¿Cuáles son las actividades activas y cómo se comparan con las anteriores?',
  })
  @IsString()
  @IsNotEmpty()
  pregunta: string;
}
