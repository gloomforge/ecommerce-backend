import { Module } from '@nestjs/common';
import { CategoryController } from '@/category/category.controller';
import { CategoryService } from '@/category/category.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
