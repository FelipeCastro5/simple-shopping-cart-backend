// infrastructure/jwt/jwt.module.ts
import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.JWT_SECRET || 'secretoSeguro123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtService, JwtStrategy],
  exports: [JwtService], // Exportamos para usar en cualquier handler
})
export class JwtCustomModule {}
