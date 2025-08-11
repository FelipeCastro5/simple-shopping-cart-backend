import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ConfigPostgresDto {
  @IsString()
  @IsNotEmpty()
  readonly host: string;

  @IsString()
  @IsNotEmpty()
  readonly user: string;

  @IsString()
  @IsNotEmpty()
  readonly database: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsInt()
  @IsNotEmpty()
  readonly port: number;
}