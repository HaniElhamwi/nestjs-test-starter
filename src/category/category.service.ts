import { ICategory } from './model/category.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryEntity } from './model';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(category: ICategory) {
    try {
      return await this.categoryRepository.save({
        ...category,
        products: [],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllCategories(take?: number, skip?: number, name?: string) {
    const query: any = {
      take,
      skip,
    };
    if (name) {
      query.where = {
        title: Like(`%${name}%`),
      };
    } else {
      delete query.where;
    }

    console.log(query);
    try {
      const [result, total] = await this.categoryRepository.findAndCount({
        order: { title: 'DESC' },
        ...query,
      });
      return {
        data: result,
        count: total,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCategory(body: ICategory, id: string) {
    try {
      const updatedProduct = await this.categoryRepository
        .createQueryBuilder()
        .update(CategoryEntity)
        .set({ ...body })
        .where('id = :id', { id })
        .execute();
      if (updatedProduct.affected != 1)
        throw new HttpException('product not found', HttpStatus.NOT_FOUND);
      return this.categoryRepository.findOne({ where: { id } });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCategory(id: string) {
    try {
      const deletedCategory = await this.categoryRepository.delete(id);
      if (deletedCategory.affected != 1)
        throw new HttpException('category not found', HttpStatus.NOT_FOUND);
      return deletedCategory;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCategory(id: string) {
    try {
      const category = await this.categoryRepository.findOneOrFail({
        where: { id },
        relations: ['products'],
      });
      if (!category)
        throw new HttpException('category not found', HttpStatus.NOT_FOUND);

      return category;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
