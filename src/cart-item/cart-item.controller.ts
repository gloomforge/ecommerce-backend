import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartService } from '@/cart-item/cart-item.service';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { User } from '@prisma/__generated__';
import { CreateCartDto } from '@/cart-item/dto/create-cart.dto';
import { UpdateCartDto } from '@/cart-item/dto/update-cart.dto';

/**
 * Контроллер для обработки операций, связанных с корзиной
 */
@Controller('carts')
export class CartController {
  /**
   *
   * @param cartService - сервис для управления элементами корзины
   */
  public constructor(private cartService: CartService) {}

  /**
   * Создает новый элемент корзины для авторизованного пользователя
   * @param user - авторизованный пользователь, для которого создается элемент корзины
   * @param model - объект для создания нового элемента корзины у пользователя
   * @returns все элементы корзины для указанного пользователя
   */
  @Post()
  @Authorization()
  public async create(@Authorized() user: User, model: CreateCartDto) {
    return this.cartService.create(user.id, model.productId, model.quantity);
  }

  /**
   * Извлекает все элементы корзины для авторизованного пользователя
   * @param user - авторизованный пользователь, чьи элементы корзины необходимо извлечь
   * @returns овсе элементы корзины для указанного пользователя
   */
  @Get()
  @Authorization()
  public async getAll(@Authorized() user: User) {
    return this.cartService.getAll(user.id);
  }

  /**
   * Обновляет количество продукта в корзине пользователя
   * @param user - авторизованный пользователь, отправляющий запрос
   * @param productId - идентификатор продукта, который нужно обновить в корзине
   * @param model - данные обновления, содержащие новое количество (по умолчанию равно 1, если не указано)
   * @returns обновленный элемент корзины
   */
  @Patch(':productId')
  @Authorization()
  public async update(
    @Authorized() user: User,
    @Param('productId') productId: string,
    model: UpdateCartDto,
  ) {
    return this.cartService.update(user.id, productId, model.quantity ?? 1);
  }

  /**
   * Удаляет продукт из корзины пользователя
   * @param user - авторизованный пользователь, отправляющий запрос
   * @param productId - идентификатор продукта, который нужно удалить из корзины
   * @returns результат выполнения сервиса
   */
  @Delete(':productId')
  @Authorization()
  public async remove(@Authorized() user: User, @Param('productId') productId: string) {
    return this.cartService.remove(user.id, productId);
  }

  /**
   * Очищает корзину для авторизованного пользователя
   * @param user - авторизованный пользователь, отправляющий запрос
   * @returns результат выполнения сервиса
   */
  @Delete()
  @Authorization()
  public async clear(@Authorized() user: User) {
    return this.cartService.clear(user.id);
  }
}
