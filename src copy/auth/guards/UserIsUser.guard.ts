import {
  Injectable,
  CanActivate,
  Inject,
  forwardRef,
  ExecutionContext,
} from '@nestjs/common';
import { User } from 'src/user/model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const user: User = request.user;

    const userData = await this.userService.findOne(user.id);
    let hasPermission = false;

    if (userData.id === Number(params.id)) {
      hasPermission = true;
    }

    return user && hasPermission;
  }
}
