import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './model';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [ProductService],
  controllers: [ProductsController],
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  exports: [ProductService],
})
export class ProductsModule {}
