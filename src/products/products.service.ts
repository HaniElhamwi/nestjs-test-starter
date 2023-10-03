import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './model';
import { Like, Repository } from 'typeorm';
import { IProductInterface } from './model/product.interface';
import { UpdatePostDto } from './model';
import { UserEntity } from 'src/user/model';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createProduct(body: IProductInterface, userId) {
    try {
      const user = await this.productRepository.save({
        ...body,
        user: userId,
      });

      return user;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllProducts(
    take?: number,
    skip?: number,
    name?: string,
    userId?: number,
    categoryId?: number,
  ) {
    const query: any = {
      take,
      skip,
    };
    if (name)
      query.where = {
        title: Like(`%${name}%`),
      };
    if (categoryId)
      query.where = {
        ...query.where,
        category: { id: categoryId },
      };
    if (userId) query.relations = [userId && 'favoritedBy'];
    try {
      const [result, total] = await this.productRepository.findAndCount({
        order: { title: 'DESC' },
        ...query,
      });

      if (userId) {
        const productsWithFavoriteStatus = result.map((product) => {
          const isFavorite = product.favoritedBy.some((u) => u.id === userId);
          delete product.favoritedBy;
          return {
            ...product,
            isFavorite,
          };
        });

        return {
          data: productsWithFavoriteStatus,
          count: total,
        };
      }

      return {
        data: result,
        count: total,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateProduct(product: UpdatePostDto, id: string) {
    try {
      const updatedProduct = await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ ...product })
        .where('id = :id', { id })
        .execute();

      if (updatedProduct.affected != 1)
        throw new HttpException('product not found', HttpStatus.NOT_FOUND);

      return this.productRepository.findOne({ where: { id } });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    return product;
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.productRepository.delete(id);
      return product;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async toggleFavorite(userId: number, productId: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['favoritedBy'],
      });

      if (!product)
        throw new HttpException('product not found', HttpStatus.NOT_FOUND);

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const isFavorite = product.favoritedBy.some((u) => u.id == userId);

      if (isFavorite) {
        product.favoritedBy = product.favoritedBy.filter((u) => u.id != userId);
      } else {
        product.favoritedBy.push(user);
      }

      await this.productRepository.save(product);

      return { isFavorite: !isFavorite };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getFavoriteProducts(userId: number) {
    try {
      const product = await this.productRepository.find({
        where: { favoritedBy: { id: userId } },
      });

      return product;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
