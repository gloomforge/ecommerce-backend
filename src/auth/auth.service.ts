import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { SessionService } from '@/auth/session/session.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, Session } from '@prisma/__generated__';
import { Request } from 'express';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  public async register(
    { fullName, email, password }: RegisterDto,
    req: Request,
  ): Promise<Omit<User, 'password'> & { session: Session }> {
    const user: Omit<User, 'password'> = await this.userService.create(
      fullName,
      email,
      password,
    );

    const session: Session = await this.sessionService.createSession(user.id);
    this.saveDataInSession(req, user.id, session.id);
    return { ...user, session };
  }

  public async login(
    { email, password }: LoginDto,
    req: Request,
  ): Promise<Omit<User, 'password'> & { session: Session }> {
    const user: User = await this.userService.findByEmail(email);
    if (user.password != password) {
      throw new UnauthorizedException('');
    }

    const session: Session = await this.sessionService.createSession(user.id);
    const { password: _password, ...otherData }: User = user;
    this.saveDataInSession(req, user.id, session.id);
    return { ...otherData, session };
  }

  private saveDataInSession(req: Request, userId: number, sessionId?: number) {
    req.session.userId = userId;
    req.session.sessionId = sessionId;
  }
}
