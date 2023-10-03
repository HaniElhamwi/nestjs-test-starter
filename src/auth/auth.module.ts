import { JwtModule } from '@nestjs/jwt';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import {
  JwtStrategy,
  RolesGuard,
  JwtAuthGuard,
  CheckTransactionPermission,
  IsAdminOrSeller,
} from './guards';
import { ProductsModule } from 'src/products/products.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/model';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ProductsModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '10000s' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
  ],
  providers: [
    AuthService,
    RolesGuard,
    JwtAuthGuard,
    JwtStrategy,
    CheckTransactionPermission,
    IsAdminOrSeller,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
