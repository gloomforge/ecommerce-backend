import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Модель для авторизации пользователя
 */
export class LoginDto {
  /**
   * Email пользователя
   * @example example@example.com
   */
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения' })
  email: string;

  /**
   * Пароль пользователя
   * @example password123
   */
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Поле пароль не может быть пустым' })
  @MinLength(6, { message: 'Пароль должен содержать не менее 6 символов' })
  password: string;
}
