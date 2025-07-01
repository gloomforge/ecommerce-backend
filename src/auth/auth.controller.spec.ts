import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  const mockRequest = () => {
    return {
      get: jest.fn(),
      set: jest.fn(),
      status: jest.fn(),
      header: jest.fn(),
      body: {},
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('должен вызвать authService.register с правильными параметрами', async () => {
      const req = mockRequest();
      const model: RegisterDto = { name: 'Тест', email: 'test@example.com', password: 'password' };
      const result = {
        id: '1',
        email: 'test@example.com',
        role: 'REGULAR',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
      };

      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await controller.register(req, model)).toBe(result);
      expect(service.register).toHaveBeenCalledWith(req, model);
    });
  });

  describe('login', () => {
    it('должен вызвать authService.login с правильными параметрами', async () => {
      const req = mockRequest();
      const model: LoginDto = { email: 'test@example.com', password: 'password' };
      const result = {
        id: '1',
        email: 'test@example.com',
        password: 'password',
        role: 'REGULAR',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
      };

      jest.spyOn(service, 'login').mockResolvedValue(result);

      expect(await controller.login(req, model)).toBe(result);
      expect(service.login).toHaveBeenCalledWith(req, model);
    });
  });

  describe('logout', () => {
    it('должен вызвать authService.logout с правильными параметрами', async () => {
      const req = mockRequest();
      const res = {};

      const result = { message: 'Успешный выход с аккаунта' };

      jest.spyOn(service, 'logout').mockResolvedValue(result);

      expect(await controller.logout(req, res)).toBe(result);
      expect(service.logout).toHaveBeenCalledWith(req, res);
    });
  });
});
