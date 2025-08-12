import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CarritoModule } from './presentation/modules/carrito.module';
import { ProductoModule } from './presentation/modules/producto.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 carga automáticamente .env
    ProductoModule, CarritoModule
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule { }
