import { UserService } from './user.service';
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':id/:type')
  async reserveSeat(
    @Param('id') id: string,
    @Param('type') type: string
  ) {
    return this.userService.reserveSeat(id, type);
  }
}
