import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseFilters } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CustomExceptionsFilter } from 'src/utils/custom-exceptions-filter';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { CreateCategoryDto } from './dto/request/create-category-request.dto';
import { UpdateCategoryDto } from './dto/request/update-category-request.dto';

@Controller('categories')
@UseFilters(CustomExceptionsFilter)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.createCategory(createCategoryDto);
    return new CommonResponseDto(HttpStatus.CREATED, 'Category created successfully', category, null);
  }

  @Get()
  async getAllCategories() {
    const categories = await this.categoriesService.getAllCategories();
    return new CommonResponseDto(HttpStatus.OK, 'Categories retrieved successfully', categories, null);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    const category = await this.categoriesService.getCategoryById(id);
    return new CommonResponseDto(HttpStatus.OK, 'Category retrieved successfully', category, null);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesService.updateCategory(+id, updateCategoryDto);
    return new CommonResponseDto(HttpStatus.OK, 'Category updated successfully', category, null);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    await this.categoriesService.deleteCategory(+id);
    return new CommonResponseDto(HttpStatus.OK, 'Category deleted successfully', null, null);
  }
}
