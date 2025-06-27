import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/__generated__';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

interface UserRequest extends Request {
  user?: { role: UserRole };
}

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const req = context.switchToHttp().getRequest<UserRequest>();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('Пользователь не найден в запросе');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Недостаточно прав. Требуются роли: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
