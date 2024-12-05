import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CustomResponseDto, PaginationMeta } from 'src/utils/custom-response.dto';
import { CreateProductDto } from './dto/request/create-product-request.dto';
import { UpdateProductDto } from './dto/request/update-product-request.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post('bulk')
  async createProducts(@Body() createProductsDto: CreateProductDto[]) {
    const products = await this.productsService.createBulkProducts(createProductsDto);
    return new CustomResponseDto(
      HttpStatus.CREATED,
      'Products created successfully',
      products,
      null, null,
    );
  }


  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.createProduct(createProductDto);
    return new CustomResponseDto(HttpStatus.CREATED, 'Product created successfully', product, null, null);
  }

  @Get()
  async getAllProducts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    const currentPage = +page || 1;
    const pageSize = +limit || 10;

    const { data, total } = await this.productsService.getAllProducts(
      currentPage,
      pageSize,
      search,
    );
    const meta = new PaginationMeta(currentPage, pageSize, total);

    return new CustomResponseDto(
      HttpStatus.OK,
      'Products retrieved successfully',
      data,
      meta,
      null,
    );
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    const product = await this.productsService.getProductById(+id);
    return new CustomResponseDto(HttpStatus.OK, 'Product retrieved successfully', product, null, null);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.updateProduct(+id, updateProductDto);
    return new CustomResponseDto(HttpStatus.OK, 'Product updated successfully', product, null, null);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    await this.productsService.deleteProduct(+id);
    return new CustomResponseDto(HttpStatus.OK, 'Product deleted successfully', null, null, null);
  }
}
