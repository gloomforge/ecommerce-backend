import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { UserRole } from '@prisma/__generated__';
import { User } from '@prisma/__generated__';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @Authorization(UserRole.ADMIN)
  public async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.userService.findAll();
  }

  @Get('by-id/:id')
  @Authorization(UserRole.ADMIN)
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<User, 'password'>> {
    return await this.userService.findById(id);
  }
}
