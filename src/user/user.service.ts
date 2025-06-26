import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    const exists = await this.prismaService.user.findUnique({ where: { email } });
    if (exists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        password,
      },
    });

    const { password: _, ...otherData } = newUser;
    return otherData;
  }
}
