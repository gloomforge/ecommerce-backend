import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста , проверьте введенные данные',
      );
    }
    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста , проверьте введенные данные',
      );
    }

    return user;
  }

  public async create(email: string, password: string) {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: password,
      },
    });

    return user;
  }
}
