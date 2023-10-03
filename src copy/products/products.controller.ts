import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './model';
import { ProductService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { CheckTransactionPermission } from 'src/auth/guards';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(@Body() body: CreatePostDto, @Req() req) {
    return this.productService.createProduct(body, req.user.id);
  }

  @Get()
  getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name: string,
    @Query('userId') userId: number,
    @Query('categoryId') categoryId: number,
  ) {
    if (!page) page = 1;
    if (!limit) limit = 10;
    return this.productService.getAllProducts(
      limit,
      (page - 1) * limit,
      name,
      userId,
      categoryId,
    );
  }

  @UseGuards(JwtAuthGuard, CheckTransactionPermission)
  @Put(':id')
  updateProduct(@Body() body: UpdatePostDto, @Param('id') id: string) {
    return this.productService.updateProduct(body, id);
  }

  @UseGuards(JwtAuthGuard, CheckTransactionPermission)
  @Delete('/:id')
  deleteProduct(@Param('id') id: string) {
    console.log(id, 'id');
    return this.productService.deleteProduct(id);
  }

  @Post(':productId/user/:userId')
  toggleFavoriteHandler(
    @Param('productId') productId,
    @Param('userId') userId,
  ) {
    return this.productService.toggleFavorite(userId, productId);
  }

  @Get('user/:userId')
  getFavoriteProducts(@Param('userId') userId: number) {
    return this.productService.getFavoriteProducts(userId);
  }
}
