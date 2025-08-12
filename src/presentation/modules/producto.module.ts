import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetProductsHandler } from 'src/application/producto/handlers/get-products.handler';
import { ProductoController } from '../controllers/producto.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductoController],
  providers: [GetProductsHandler],
})
export class ProductoModule {}
