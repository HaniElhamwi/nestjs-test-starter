import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto, CreatePostDto } from './model';
import { CategoryService } from './category.service';
import { IsAdminOrSeller, JwtAuthGuard } from 'src/auth/guards';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, IsAdminOrSeller)
  @Post()
  createCategory(@Body() body: CreatePostDto) {
    this.categoryService.createCategory(body);
  }

  @Get()
  getAllCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name,
  ) {
    if (!page) page = 1;
    if (!limit) limit = 10;
    console.log(name);
    return this.categoryService.getAllCategories(
      limit,
      limit * (page - 1),
      name,
    );
  }

  @Get(':id')
  getCategory(@Param('id') id: string) {
    return this.categoryService.getCategory(id);
  }

  @UseGuards(JwtAuthGuard, IsAdminOrSeller)
  @Put(':id')
  updateProduct(@Body() body: CreateCategoryDto, @Param('id') id: string) {
    return this.categoryService.updateCategory(body, id);
  }

  @UseGuards(JwtAuthGuard, IsAdminOrSeller)
  @Delete()
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
