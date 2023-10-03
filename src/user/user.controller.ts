import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {}

  @Post('signup')
  createPost(@Body() body: CreateUserDto) {
    return this.userService.signup(body);
  }

  @Post('login')
  login(@Body() user: LoginUserDto) {
    return this.userService.login(user.email, user.password);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: { token: string }) {
    return this.userService.refreshTokenHandler({ token: body.token });
  }
}
