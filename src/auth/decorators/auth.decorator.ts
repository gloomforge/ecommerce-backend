import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { UserRole } from '@prisma/__generated__';
import { Roles } from './roles.decorator';

/**
 * Декоратор для авторизации пользователей с определенными ролями.
 *
 * Данный декоратор применяет защиту на основе ролей и аутентификации.
 * Если указаны роли, применяется также декоратор Roles.
 *
 * @param roles - массив ролей, для которых требуется доступ
 * @returns
 */
export function Authorization(...roles: UserRole[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }

  return applyDecorators(UseGuards(AuthGuard));
}
