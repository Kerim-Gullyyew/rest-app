import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Get('user/:userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }


  @Get('user/:userId/avatar')
  async getUserAvatar(@Param('userId') userId: string): Promise<string> {
    return this.userService.getUserAvatar(userId);
  }


  @Delete('user/:userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string) {
    return this.userService.deleteUserAvatar(userId);
  }
}
