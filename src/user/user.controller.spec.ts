import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
// import type { User } from '@prisma/__generated__';

function Authorization(role?: string) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    return descriptor;
  };
}

function Authorized(property: string) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    return target;
  };
}

describe('UserController', () => {
  let userController: UserController;
  const mockUserService = {
    findById: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
  };

  const mockUser: any = {
    id: '123',
    email: 'test@example.com',
    password: 'password',
    role: 'REGULAR',
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: true,
  };

  const updateUserDto: UpdateUserDto = {
    email: 'updated@example.com',
    name: 'Имя пользователя',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  describe('findProfile', () => {
    it('должен вернуть профиль по userId', async () => {
      mockUserService.findById.mockResolvedValue(mockUser);
      const result = await userController.findProfile('123');
      expect(result).toEqual(mockUser);
      expect(mockUserService.findById).toHaveBeenCalledWith('123');
    });
  });

  describe('updateProfile', () => {
    it('должен обновить профиль пользователя и вернуть обновленного пользователя', async () => {
      mockUserService.update.mockResolvedValue(mockUser);
      const result = await userController.updateProfile('123', updateUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUserService.update).toHaveBeenCalledWith('123', updateUserDto);
    });
  });

  describe('findAll', () => {
    it('должен вернуть массив пользователей', async () => {
      const users: any[] = [mockUser];
      mockUserService.findAll.mockResolvedValue(users);
      const result = await userController.findAll();
      expect(result).toEqual(users);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });
});
