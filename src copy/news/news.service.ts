import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INews, NewsEntity } from './model';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) {}

  async createNews(body: INews) {
    const news = new NewsEntity();
    news.headTitle = body.headTitle;
    news.title = body.title;
    news.image = body.image;
    news.description = body.description;

    return this.newsRepository.save(news);
  }

  async getAllNews() {
    return this.newsRepository.find();
  }
}
