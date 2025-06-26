import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prismaMock: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('findById', () => {
    it('должен вернуть пользователя', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'secret' };
      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await service.findById(1);
      expect(result).toBe(user);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('должен вывести что пользователь не найден', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('должен вернуть пользователя', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'secret' };
      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('test@test.com');
      expect(result).toBe(user);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('должен вывести что пользователь не найден', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.findByEmail('test@test.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('должен вернуть что пользователь уже существует', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'secret' };
      prismaMock.user.findUnique.mockResolvedValue(user);

      await expect(service.create('test@test.com', 'secret')).rejects.toThrow(
        ConflictException,
      );
    });

    it('должен создать пользователя', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'secret' };
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(user);

      await service.create('test@test.com', 'secret');
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: { email: 'test@test.com', password: 'secret' },
      });
    });
  });
});
