import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class SessionService {
  private ttl: number;

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.ttl = Number(this.configService.get<string>('SESSION_TTL'));
  }

  public async createSession(userId: number) {
    await this.prismaService.session.deleteMany({
      where: {
        userId,
      },
    });

    const session = await this.prismaService.session.create({
      data: {
        userId,
        token: randomBytes(32).toString('hex'),
        expireAt: new Date(Date.now() + this.ttl),
      },
    });

    return session;
  }
}
