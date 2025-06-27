import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '@/user/user.service';

type SessionWithUserId = {
  session?: { userId?: number };
  user?: any;
};

type AuthRequest = Request & SessionWithUserId;

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();

    const userId = req.session?.userId;
    if (!userId) {
      throw new UnauthorizedException(
        'Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ к ресурсу',
      );
    }

    const user = await this.userService.findById(userId);
    req.user = user;

    return true;
  }
}
