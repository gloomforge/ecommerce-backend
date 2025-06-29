import { Param, Controller, Get, Res, NotFoundException } from '@nestjs/common';
import { CategoryService } from '@/category/category.service';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Контроллер для управления категориями
 * только получение категорий товаров
 */
@Controller('categories')
export class CategoryController {
  /**
   * Конструктор контроллера категорий
   * @param categoryService - сервис для категорий
   */
  public constructor(private readonly categoryService: CategoryService) {}

  /**
   * Получение всех категорий
   * @returns массив всех категорий
   */
  @Get()
  public async findAll() {
    return this.categoryService.findAll();
  }

  /**
   * Получение категории по id
   * @param id - идентификатор категории
   * @returns найденная категория
   */
  @Get(':id')
  public async findById(@Param('id') id: string) {
    return await this.categoryService.findById(id);
  }

  /**
   * Получение категории по name
   * @param name - название категории
   * @returns найденная категория
   */
  @Get('name/:name')
  public async findByName(@Param('name') name: string) {
    return this.categoryService.findByName(name);
  }

  /**
   * Получение изображения категории
   * @param filename - имя файла изображения
   * @param res - объект ответа express
   * @returns изображение по его названию
   */
  @Get('images/:filename')
  public getImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = join(process.cwd(), './src/category/images', filename);

    if (!existsSync(imagePath)) {
      throw new NotFoundException('Изображение не найдено');
    }

    res.sendFile(imagePath);
  }
}
