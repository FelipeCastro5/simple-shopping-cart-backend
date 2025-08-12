import { ApiProperty } from '@nestjs/swagger';

export class ProductoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Producto 1' })
  name: string;

  @ApiProperty({ example: 100 })
  price: number;
}
