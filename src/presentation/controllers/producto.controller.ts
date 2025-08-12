import { Controller, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetProductsCommand } from '../../application/producto/commands/get-products.command';
import { Producto } from '../../domain/producto/products.data';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductoDto } from '../dtos/producto.dto';

@ApiTags('Productos')
@Controller('products')
export class ProductoController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
    type: [ProductoDto], // Lo definiremos abajo
  })
  async getProducts(): Promise<Producto[]> {
    return this.commandBus.execute(new GetProductsCommand());
  }
}
