import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { Session } from '@prisma/__generated__';

@Injectable()
export class SessionService {
  private ttl: number;

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.ttl = Number(this.configService.get<string>('SESSION_TTL'));
  }

  public async getSessionByToken(token: string): Promise<Session | null> {
    return this.prismaService.session.findFirst({
      where: { token, expireAt: { gt: new Date() } },
    });
  }

  public async validateSession(sessionId: number, userId: number) {
    const session = await this.prismaService.session.findFirst({
      where: {
        id: sessionId,
        userId,
        expireAt: {
          gt: new Date(),
        },
      },
    });

    return !!session;
  }

  public async createSession(userId: number): Promise<Session> {
    await this.prismaService.session.deleteMany({
      where: {
        userId,
      },
    });

    const session: Session = await this.prismaService.session.create({
      data: {
        userId,
        token: randomBytes(32).toString('hex'),
        expireAt: new Date(Date.now() + this.ttl),
      },
    });

    return session;
  }
}
