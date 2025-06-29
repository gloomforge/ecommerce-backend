import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CategoryService } from '@/category/category.service';

/**
 * Сервис для работы с продуктами/товарами
 */
@Injectable()
export class ProductService {
  /**
   * Конструктор контроллера продуктов/товаров
   * @param prismaService - сервис для работы с базой данных
   * @param categoryService - сервис для работы с категориями
   */
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * Находит все товары/продукты для данной категории
   * @param category - имя категории
   * @throws {NotFoundException} - если категория не найдена
   * @returns массив товаров/продуктов для данной категории
   */
  public async findAllByCategory(category: string) {
    const categoryExists = await this.categoryService.findByName(category);

    if (!categoryExists) {
      throw new NotFoundException('Категории не найдены, проверьте введенные данные');
    }

    return this.prismaService.product.findMany({
      where: {
        category: {
          name: category,
        },
      },
      include: {
        category: true,
      },
    });
  }
}
