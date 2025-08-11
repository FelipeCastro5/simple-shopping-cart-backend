import { Test, TestingModule } from '@nestjs/testing';
import { PostgresService } from './postgres.service';
import { ConfigService } from '@nestjs/config';

describe('PostgresService', () => {
  let service: PostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostgresService,
        { provide: ConfigService, useValue: {} }, // Mock de ConfigService
      ],
    }).compile();

    service = module.get<PostgresService>(PostgresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});