// infrastructure/jwt/jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  async generarToken(payload: any, expiresIn = '1h'): Promise<string> {
    return this.jwt.signAsync(payload, { expiresIn });
  }

  async verificarToken(token: string): Promise<any> {
    return this.jwt.verifyAsync(token);
  }
}
