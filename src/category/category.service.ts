import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Сервис для работы с категориями
 */
@Injectable()
export class CategoryService {
  /**
   * Конструктор сервиса категорий
   * @param prismaService - сервис для работы с базой данных
   */
  public constructor(private readonly prismaService: PrismaService) {}

  /**
   * Получение всех категорий
   * @returns массив всех категорий
   */
  public async findAll() {
    return this.prismaService.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Получение категории по id
   * @param id - идентификатор категории
   * @returns найденная категория
   * @throws {NotFoundException} - если пользователь не найден
   */
  public async findById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException(
        'Категория не найдена, возможно данной категории нету или проверьте введенные данные',
      );
    }

    return category;
  }

  /**
   * Поиск категории по названию
   * @param name - название категории
   * @returns найденная категория
   * @throws {NotFoundException} - если пользователь не найден
   */
  public async findByName(name: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        name,
      },
    });

    if (!category) {
      throw new NotFoundException(
        'Категория не найдена, возможно данной категории нету или проверьте введенные данные',
      );
    }

    return category;
  }
}
