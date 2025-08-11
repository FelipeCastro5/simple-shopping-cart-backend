import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: 1, description: 'ID del proyecto a actualizar' })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Proyecto Beta', description: 'Nuevo nombre del proyecto' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Actualización del detalle del proyecto', description: 'Nuevos detalles del proyecto' })
  @IsNotEmpty()
  @IsString()
  details: string;
}
