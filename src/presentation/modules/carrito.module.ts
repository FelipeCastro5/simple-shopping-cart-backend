import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddProductHandler } from '../../application/carrito/handlers/add-product.handler';
import { GetCartHandler } from '../../application/carrito/handlers/get-cart.handler';
import { CarritoRepository } from '../../domain/carrito/carrito.repository';
import { CarritoController } from '../controllers/carrito.controller';

@Module({
  imports: [CqrsModule],
  controllers: [CarritoController],
  providers: [CarritoRepository, AddProductHandler, GetCartHandler],
})
export class CarritoModule {}
