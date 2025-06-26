import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async registerUser(@Body() model: RegisterDto) {
    return await this.authService.register(model);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async loginUser(@Body() model: LoginDto) {
    return await this.authService.login(model);
  }
}
