import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './model/dto';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}
  @Post('')
  createNews(@Body() body: CreateNewsDto) {
    return this.newsService.createNews(body);
  }
  @Get()
  getAllNews() {
    return this.newsService.getAllNews();
  }
}
