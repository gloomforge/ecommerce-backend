import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Сервис для управления элементами корзины.
 * Предоставляет методы для получения, создания, обновления и удаления элементов корзины
 */
@Injectable()
export class CartService {
  /**
   *
   * @param prismaService - сервис для работы с базой данных
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Извлекает все элементы корзины для конкретного пользователя
   * @param userId - идентификатор пользователя, чьи элементы корзины необходимо извлечь
   * @returns массив данных корзины
   */
  async getAll(userId: string) {
    return this.prismaService.cartItem.findMany({
      where: { accountId: userId },
      include: { product: true },
    });
  }

  /**
   * Создает или обновляет элемент корзины для пользователя
   * Если элемент уже существует в корзине, увеличивает его количество
   * В противном случае создает новый элемент корзины с указанным количеством
   *
   * @param userId - идентификатор пользователя/аккаунта
   * @param productId - идентификатор продукта, который нужно добавить в корзину
   * @param quantity - количество для добавления или увеличения
   * @returns созданный или обновленный элемент корзины
   */
  async create(userId: string, productId: string, quantity: number) {
    return this.prismaService.cartItem.upsert({
      where: { accountId_productId: { accountId: userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { accountId: userId, productId, quantity },
    });
  }

  /**
   * Обновляет количество конкретного продукта в корзине пользователя
   * @param userId - идентификатор пользователя, чья корзина обновляется
   * @param productId - идентификатор продукта, который нужно обновить в корзине
   * @param quantity - новое количество продукта в корзине
   * @throws {NotFoundException} - если элемент корзины не найден
   * @returns обновленный элемент корзины
   */
  async update(userId: string, productId: string, quantity: number) {
    const item = await this.prismaService.cartItem.findUnique({
      where: { accountId_productId: { accountId: userId, productId } },
    });

    if (!item) {
      throw new NotFoundException('Элемент корзины не найден');
    }

    return this.prismaService.cartItem.update({
      where: { accountId_productId: { accountId: userId, productId } },
      data: { quantity },
    });
  }

  /**
   * Удаляет элемент корзины для конкретного пользователя и продукта
   * @param userId - идентификатор пользователя, чей элемент корзины должен быть удален
   * @param productId - идентификатор продукта, который нужно удалить из корзины
   * @returns объект, указывающий на успешность операции.
   */
  async remove(userId: string, productId: string) {
    await this.prismaService.cartItem.delete({
      where: { accountId_productId: { accountId: userId, productId } },
    });

    return { success: true };
  }

  /**
   * Очищает все элементы корзины для конкретного пользователя
   * @param userId - идентификатор пользователя, чьи элементы корзины должны быть очищены
   * @returns объект, указывающий на успешность операции
   */
  async clear(userId: string) {
    await this.prismaService.cartItem.deleteMany({ where: { accountId: userId } });

    return { success: true };
  }
}
