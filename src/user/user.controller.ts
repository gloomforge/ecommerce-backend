import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('by-id/:id')
  public async findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}
