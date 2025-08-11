import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MinLength } from 'class-validator';

export class ChatbotPreguntaDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsInt()
  fk_user: number;

  @ApiProperty({ example: '¿Qué es NestJS?', description: 'Pregunta del usuario' })
  @IsString()
  @MinLength(3)
  pregunta: string;
}

export class ChatbotRespuestaDto {
  @ApiProperty({ example: 'NestJS es un framework para Node.js...', description: 'Respuesta generada por la IA' })
  respuesta: string;
}