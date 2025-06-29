import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { Request, Response } from 'express';

/**
 * Контроллер для управления авторизацией пользователей
 */
@Controller('auth')
export class AuthController {
  /**
   * Конструктор контроллера аутентификации
   * @param authService - сервис для аутентификации
   */
  public constructor(private readonly authService: AuthService) {}

  /**
   * Регистрация нового пользователя
   * @param req - объект запроса express
   * @param model - объект с данными для регистрации пользователя
   * @returns ответ от сервиса аутентификации
   */
  @Post('register')
  public async register(@Req() req: Request, @Body() model: RegisterDto) {
    return this.authService.register(req, model);
  }

  /**
   * Авторизация пользователя
   * @param req - объект запроса express
   * @param model - объект с данными для авторизации пользователя
   * @returns ответ от сервиса аутентификации
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public login(@Req() req: Request, @Body() model: LoginDto) {
    return this.authService.login(req, model);
  }

  /**
   * Завершение сессии пользователя
   * @paran req - объект запроса express
   * @returns ответ от сервиса аутентификации
   */
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  public logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
}
