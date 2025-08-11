import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    example: 'destinatario@example.com',
    description: 'Correo del destinatario',
  })
  @IsEmail({}, { message: 'El correo proporcionado no es válido' })
  to: string;

  @ApiProperty({
    example: 'Asunto del correo',
    description: 'Asunto del mensaje',
  })
  @IsString({ message: 'El asunto debe ser un texto' })
  @IsNotEmpty({ message: 'El asunto no puede estar vacío' })
  @MaxLength(100, { message: 'El asunto no puede superar los 100 caracteres' })
  subject: string;

  @ApiProperty({
    example: 'Este es el cuerpo del correo',
    description: 'Contenido del mensaje',
  })
  @IsString({ message: 'El cuerpo debe ser un texto' })
  @IsNotEmpty({ message: 'El cuerpo no puede estar vacío' })
  body: string;
}
