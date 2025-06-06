import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: PrismaService,
          useValue: {}, // Mock PrismaService
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
