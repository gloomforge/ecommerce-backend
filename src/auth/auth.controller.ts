import { Controller, Get, Post, HttpCode, HttpStatus, Body, Req } from '@nestjs/common';
import { Authorization } from './decorators/auth.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async registerUser(@Body() model: RegisterDto, @Req() req: Request) {
    console.info('регистрация прошла успешна');
    return await this.authService.register(model, req);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async loginUser(@Body() model: LoginDto, @Req() req: Request) {
    return await this.authService.login(model, req);
  }

  @Get('me')
  @Authorization()
  @HttpCode(HttpStatus.OK)
  public getMe() {
    return { message: 'Подтверждение, прошло успешно' };
  }
}
