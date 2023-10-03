import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ProductService } from 'src/products/products.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CheckTransactionPermission implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.params.id) return false;
    const findUser = await this.userService.findOne(request.user.id);
    if (findUser.role === 'user') return false;
    if (findUser.role === 'seller') {
      const findProduct = await this.productService.findOne(request.params.id);
      if (findProduct.user.id !== request.user.id) return false;
    } else if (findUser.role === 'admin') {
      return true;
    }
    return false;
  }
}
