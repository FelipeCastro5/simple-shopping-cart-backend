import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 carga automáticamente .env
    
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule { }
