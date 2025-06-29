import { UserRole } from '@prisma/__generated__';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Декоратор для установки метаданных ролей.
 * Этот декоратор позволяет указать роли, необходимые для доступа к методу или классу
 *
 * @param roles - массив ролей, которые должны быть установлены в метаданных
 * @returns устанавливаем роли в метаданных.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
