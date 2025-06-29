import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Контроллер для работы с продуктами/товаром
 */
@Controller('category/products')
export class ProductController {
  /**
   *
   * @param productService - сервис для работы с продуктами/товарами
   */
  public constructor(private readonly productService: ProductService) {}

  /**
   * Получает все товары определенной категории
   * @param category - имя категории
   * @returns массив товаров/продуктов для данной категории
   */
  @Get(':category')
  public async findAllByCategory(@Param('category') category: string) {
    return this.productService.findAllByCategory(category);
  }

  /**
   * Получение изображения категории
   * @param filename - имя файла изображения
   * @param res - объект ответа express
   * @returns изображение по его названию
   */
  @Get('images/:filename')
  public getImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = join(process.cwd(), './src/product/images', filename);

    if (!existsSync(imagePath)) {
      throw new NotFoundException('Изображение не найдено');
    }

    res.sendFile(imagePath);
  }
}
