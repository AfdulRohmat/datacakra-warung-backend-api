import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseFilters } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CustomExceptionsFilter } from 'src/utils/custom-exceptions-filter';
import { CustomResponseDto } from 'src/utils/custom-response.dto';
import { CreateCategoryDto } from './dto/request/create-category-request.dto';
import { UpdateCategoryDto } from './dto/request/update-category-request.dto';

@Controller('categories')
@UseFilters(CustomExceptionsFilter)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post('bulk')
  async createCategories(@Body() createCategoriesDto: CreateCategoryDto[]) {
    const categories = await this.categoriesService.createBulkCategories(createCategoriesDto);
    return new CustomResponseDto(HttpStatus.CREATED, 'Categories created successfully', categories, null, null);
  }


  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.createCategory(createCategoryDto);
    return new CustomResponseDto(HttpStatus.CREATED, 'Category created successfully', category, null, null);
  }

  @Get()
  async getAllCategories() {
    const categories = await this.categoriesService.getAllCategories();
    return new CustomResponseDto(HttpStatus.OK, 'Categories retrieved successfully', categories, null, null);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    const category = await this.categoriesService.getCategoryById(id);
    return new CustomResponseDto(HttpStatus.OK, 'Category retrieved successfully', category, null, null);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesService.updateCategory(+id, updateCategoryDto);
    return new CustomResponseDto(HttpStatus.OK, 'Category updated successfully', category, null, null);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    await this.categoriesService.deleteCategory(+id);
    return new CustomResponseDto(HttpStatus.OK, 'Category deleted successfully', null, null, null);
  }
}
