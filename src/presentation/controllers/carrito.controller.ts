import { Controller, Get, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddProductCommand } from '../../application/carrito/commands/add-product.command';
import { GetCartCommand } from '../../application/carrito/commands/get-cart.command';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Carrito')
@Controller('cart')
export class CarritoController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'number', example: 1 },
      },
      required: ['productId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Producto agregado correctamente' })
  @ApiResponse({ status: 400, description: 'Producto no encontrado' })
  async addProductToCart(@Body('productId') productId: number) {
    return this.commandBus.execute(new AddProductCommand(productId));
  }

  @Get()
  @ApiOperation({ summary: 'Obtener productos en el carrito' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos en el carrito',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          price: { type: 'number' },
        },
      },
    },
  })
  async getCart() {
    return this.commandBus.execute(new GetCartCommand());
  }
}
