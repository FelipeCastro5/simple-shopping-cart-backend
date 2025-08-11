import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Proyecto Alpha', description: 'Nombre del proyecto' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Detalles del proyecto Alpha', description: 'Descripción o detalles del proyecto' })
  @IsNotEmpty()
  @IsString()
  details: string;
}
