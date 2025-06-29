import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { $Enums } from '@prisma/__generated__';
import UserRole = $Enums.UserRole;
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Контроллер для работы с пользователями
 */
@Controller('users')
export class UserController {
  /**
   * Конструктор контроллера пользователей
   * @param userService - сервис для работы с пользователями
   */
  public constructor(private readonly userService: UserService) {}

  /**
   * Получает профиль текущего пользователя
   * @param userId - id авторизированного пользователя
   * @returns профиль пользователя
   */
  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }

  /**
   * Обновляет профиль текущего пользователя
   * @param userId - id авторизованного пользователя
   * @param model - данные для обновления профиля
   * @returns обновленный профиль пользователя
   */
  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Patch('profile')
  public async updateProfile(
    @Authorized('id') userId: string,
    @Body() model: UpdateUserDto,
  ) {
    return this.userService.update(userId, model);
  }

  /**
   * Получение всех пользователей (доступ только для администраторов)
   * @returns ответ от сервиса пользователей (возвращает массив пользователей без пароля)
   */
  @Get()
  @Authorization(UserRole.ADMIN)
  public async findAll() {
    return this.userService.findAll();
  }
}
