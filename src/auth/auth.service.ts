import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { SessionService } from '@/session/session.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  public async register({ email, password }: RegisterDto) {
    const user = await this.userService.create(email, password);
    const session = await this.sessionService.createSession(user.id);
    return { user, session };
  }

  public async login({ email, password }: LoginDto) {
    const user = await this.userService.findByEmail(email);
    if (user.password != password) {
      throw new UnauthorizedException('');
    }

    const session = await this.sessionService.createSession(user.id);
    const { password: _password, ...otherData } = user;
    return { otherData, session };
  }
}
