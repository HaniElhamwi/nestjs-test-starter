import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './model';

@Module({
  providers: [NewsService],
  controllers: [NewsController],
  imports: [TypeOrmModule.forFeature([NewsEntity])],
})
export class NewsModule {}
