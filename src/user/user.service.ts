import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Account, User } from '@prisma/__generated__';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAll(): Promise<Omit<User, 'password'>[]> {
    const users: User[] = await this.prismaService.user.findMany();

    return users.map((user) => {
      const { password: _, ...otherData } = user;
      return otherData;
    });
  }

  public async findById(id: number): Promise<User> {
    const user: User | null = await this.prismaService.user.findUnique({
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

  public async findByEmail(email: string): Promise<User> {
    const user: User | null = await this.prismaService.user.findUnique({
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

  public async create(
    fullName: string,
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> & { account: Account }> {
    const exists: User | null = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const newUser: User = await this.prismaService.user.create({
      data: {
        email,
        password,
      },
    });

    const account: Account = await this.prismaService.account.create({
      data: {
        userId: newUser.id,
        fullName,
        constact: {
          create: [
            {
              type: 'EMAIL',
              value: email,
            },
          ],
        },
      },
    });

    const { password: _, ...otherData }: User = newUser;
    return { ...otherData, account };
  }
}
