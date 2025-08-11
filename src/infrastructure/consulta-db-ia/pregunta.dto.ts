import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsInt, Min } from 'class-validator';

export class PreguntaDto {
  @ApiProperty({
    description: 'ID del usuario que hace la pregunta.',
    example: 1,
  })
  @IsInt()
  @Min(1)
  fk_user: number;

  @ApiProperty({
    description: 'Pregunta que el usuario desea realizar en relación a la base de datos.',
    example: '¿Cuál es el proyecto de Loan Palomera?',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'La pregunta no puede estar vacía' })
  @MaxLength(500, { message: 'La pregunta no puede exceder los 500 caracteres' })
  pregunta: string;
}
