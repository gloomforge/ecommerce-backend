import { Module } from '@nestjs/common';
import { CartService } from '@/cart-item/cart-item.service';
import { CartController } from '@/cart-item/cart-item.controller';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
