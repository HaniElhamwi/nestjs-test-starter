import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      host: configService.get('SQL_HOST'),
      port: configService.get('SQL_PORT'),
      username: configService.get('SQL_USERNAME'),
      password: configService.get('SQL_PASSWORD'),
      database: configService.get('DB_NAME'),
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    };
  },
};
