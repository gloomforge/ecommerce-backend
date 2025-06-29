import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '@/user/user.service';

/**
 * Guard для проверки аутентификации пользователя
 */
@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  /**
   * Проверяет, имеет ли пользователь доступ к ресурсу
   * @param context - контекст выполнения, содержащий информацию о текущем запросе
   * @returns true, если пользователь аутентифицирован; в противном случае выбрасываем ошибку
   * @throws UnauthorizedException
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (typeof request.session.userId !== 'undefined') {
      request.user = await this.userService.findById(request.session.userId);
      return true;
    } else {
      throw new UnauthorizedException(
        'Пользователь не авторизирован. Пожалуйста, войдите в систему, чтобы получить доступ',
      );
    }
  }
}
