import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Модель для обновления профиля пользователя
 */
export class UpdateUserDto {
  /**
   * Электронная почта пользователя
   * @example example@example.com
   */
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения' })
  email: string;

  /**
   * Имя пользователя
   * @example test
   */
  @IsString({ message: 'Имя должен быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
  name: string;
}
