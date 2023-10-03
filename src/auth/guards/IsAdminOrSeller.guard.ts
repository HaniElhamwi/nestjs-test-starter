import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class IsAdminOrSeller implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.user.id) return false;
    const findUser = await this.userService.findOne(request.user.id);
    if (findUser.role === 'user') return false;
    if (findUser.role === 'seller' && findUser.verified) return true;
    else if (findUser.role === 'admin') return true;
    return false;
  }
}
