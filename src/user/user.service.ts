import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/__generated__';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Сервис для работы с пользователями
 */
@Injectable()
export class UserService {
  /**
   * Конструктор сервиса пользователей
   * @param prismaService - сервис для работы с базой данных
   */
  public constructor(private readonly prismaService: PrismaService) {}

  /**
   * Находит всех пользователей в бд и удаляет пароль
   * @returns массив пользователей без пароля
   */
  public async findAll() {
    const users = await this.prismaService.user.findMany();
    const container: Omit<User, 'password'>[] = [];

    users.map((user) => {
      const { password: _, ...data } = user;
      container.push(data);
    });

    return container;
  }

  /**
   * Находит пользователя по ID
   * @param id - ID пользователя
   * @returns найденный пользователь
   * @throws {NotFoundException} если пользователь не найден
   */
  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        account: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста, проверьте введенные данные.',
      );
    }

    const { password: _, ...data } = user;
    return data;
  }

  /**
   * Находит пользователя по email
   * @param email - email пользователя
   * @returns {Promise<User | null>} найденный пользователь или null, если не найден
   */
  public async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        account: true,
      },
    });
  }

  /**
   * Обновляет данные пользователя
   * @param userId - id пользователя
   * @param model - данные для обновления пользователя
   * @returns обновленный пользователь
   */
  public async update(userId: string, model: UpdateUserDto) {
    const user = await this.findById(userId);

    return await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: model.email,
        account: {
          update: {
            fullName: model.name,
          },
        },
      },
      include: { account: true },
    });
  }

  /**
   * Создает нового пользователя
   * @param email - email пользователя
   * @param password - пароль пользователя
   * @param displayName - отображаемое имя пользователя
   * @returns созданный пользователь
   */
  public async create(email: string, password: string, displayName: string) {
    return this.prismaService.user.create({
      data: {
        email,
        password,
        account: {
          create: {
            fullName: displayName,
          },
        },
      },
    });
  }
}
