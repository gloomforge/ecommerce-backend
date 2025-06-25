import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async create(userId: number, userAgent?: string) {
    const expireAt = new Date(
      Date.now() + this.configService.getOrThrow<number>('SESSION_TTL'),
    );
    return await this.prismaService.session.create({
      data: {
        userId,
        expireAt,
        userAgent,
      },
    });
  }
}
