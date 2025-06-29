import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { RegisterDto } from '@/auth/dto/register.dto';
import { UserService } from '@/user/user.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { Request, Response } from 'express';
import { SessionService } from '@/auth/session/session.service';

/**
 * Сервис для аутентификации и управления сессиями пользователя
 */
@Injectable()
export class AuthService {
  /**
   * Конструктор сервиса аутентификации
   * @param userService - сервис для работы с пользователями
   * @param sessionService - сервис для работы с сессиями
   */
  public constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Регистрация нового пользователя
   * @param req - объект запроса express
   * @param model - объект с данными для регистрации пользователя
   * @returns объект с сообщением об успешной регистрации (без пароля пользователя)
   * @throws ConflictException - если пользователь с таким email уже существует
   */
  public async register(req: Request, model: RegisterDto) {
    const existsUser = await this.userService.findByEmail(model.email);

    if (existsUser) {
      throw new ConflictException(
        'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста используйте другой email или войдите в систему',
      );
    }

    const user = await this.userService.create(model.email, model.password, model.name);

    const { password: _, ...confirmData } = user;
    await this.sessionService.saveSession(req, confirmData.id);
    return confirmData;
  }

  /**
   * Авторизация существующего пользователя
   * @param req - объект запроса express
   * @param model - объект с данными для авторизации пользователя
   * @returns объект с сообщением об успешной авторизации
   * @throws NotFoundException - если пользователь не найден
   * @throws UnauthorizedException - если пароль неверный
   */
  public async login(req: Request, model: LoginDto) {
    const userEntity = await this.userService.findByEmail(model.email);

    if (!userEntity) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста проверьте введенные данные',
      );
    }

    if (userEntity.password != model.password) {
      throw new UnauthorizedException(
        'Неверный пароль или email. Пожалуйста попробуйте еще раз или создайте новую учетную запись',
      );
    }

    await this.sessionService.saveSession(req, userEntity.id);
    return userEntity;
  }

  /**
   * Завершает текущую сессию пользователя
   * @param req - объект запроса express
   * @param res - объект ответа express
   * @returns ответ в виде сообщения об успешном завершении сессии (успешный выход с аккаунта)
   */
  public async logout(req: Request, res: Response) {
    await this.sessionService.clearSession(req, res);

    return { message: 'Успешный выход с аккаунта' };
  }
}
