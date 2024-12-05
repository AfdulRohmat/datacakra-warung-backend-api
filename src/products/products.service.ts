import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { Product } from './enitities/product.entity';
import { CreateProductDto } from './dto/request/create-product-request.dto';
import { UpdateProductDto } from './dto/request/update-product-request.dto';
import { ProductResponseDto } from './dto/response/product-response.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async createBulkProducts(createProductsDto: CreateProductDto[]): Promise<ProductResponseDto[]> {
        const products = createProductsDto.map((dto) =>
            this.productRepository.create({
                ...dto,
                category: { id: dto.categoryId }, // Set category relationship
            }),
        );

        const savedProducts = await this.productRepository.save(products);

        return savedProducts.map(
            (product) =>
                new ProductResponseDto(
                    product.id,
                    product.name,
                    product.sku,
                    product.description,
                    product.weight,
                    product.width,
                    product.length,
                    product.height,
                    product.image,
                    product.price,
                    product.category.id,
                    product.category,
                    product.createdAt,
                    product.updatedAt,
                ),
        );
    }


    async createProduct(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        const { sku, name, categoryId } = createProductDto;

        const existingProduct = await this.productRepository.findOne({
            where: { sku },
            withDeleted: true,
        });

        if (existingProduct) {
            if (existingProduct.deletedAt) {
                // Restore soft-deleted product
                existingProduct.deletedAt = null;
                const restoreProduct = await this.productRepository.save(existingProduct);

                return new ProductResponseDto(
                    restoreProduct.id,
                    restoreProduct.name,
                    restoreProduct.sku,
                    restoreProduct.description,
                    restoreProduct.weight,
                    restoreProduct.width,
                    restoreProduct.length,
                    restoreProduct.height,
                    restoreProduct.image,
                    restoreProduct.price,
                    restoreProduct.category.id,
                    restoreProduct.category,
                    restoreProduct.createdAt,
                    restoreProduct.updatedAt,
                );
            }
            throw new BadRequestException(`Product with SKU '${sku}' already exists`);
        }

        const product = this.productRepository.create({
            ...createProductDto,
            category: { id: categoryId }, // Set category relationship
        });
        const savedProduct = await this.productRepository.save(product);

        return new ProductResponseDto(
            savedProduct.id,
            savedProduct.name,
            savedProduct.sku,
            savedProduct.description,
            savedProduct.weight,
            savedProduct.width,
            savedProduct.length,
            savedProduct.height,
            savedProduct.image,
            savedProduct.price,
            savedProduct.category.id,
            savedProduct.category,
            savedProduct.createdAt,
            savedProduct.updatedAt,
        );
    }

    async getAllProducts(
        page: number = 1,
        limit: number = 10,
        search?: string,
    ): Promise<{ data: ProductResponseDto[]; total: number }> {
        const offset = (page - 1) * limit;

        // Build where condition for search
        const whereCondition = [
            { name: Like(`%${search || ''}%`), deletedAt: IsNull() },
            { sku: Like(`%${search || ''}%`), deletedAt: IsNull() },
            { category: { name: Like(`%${search || ''}%`) }, deletedAt: IsNull() },
        ];

        // Query products with pagination and relations
        const [products, total] = await this.productRepository.findAndCount({
            where: whereCondition,
            relations: ['category'], // Include category relationship
            take: limit, // Limit for pagination
            skip: offset, // Offset for pagination
            order: { createdAt: 'DESC' }, // Sort by creation date
        });

        const productDtos = products.map(
            (product) =>
                new ProductResponseDto(
                    product.id,
                    product.name,
                    product.sku,
                    product.description,
                    product.weight,
                    product.width,
                    product.length,
                    product.height,
                    product.image,
                    product.price,
                    product.category.id,
                    product.category,
                    product.createdAt,
                    product.updatedAt,
                ),
        );

        return { data: productDtos, total };
    }

    async getProductById(id: number): Promise<ProductResponseDto> {
        const product = await this.productRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['category'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID '${id}' not found`);
        }

        return new ProductResponseDto(
            product.id,
            product.name,
            product.sku,
            product.description,
            product.weight,
            product.width,
            product.length,
            product.height,
            product.image,
            product.price,
            product.category.id,
            product.category,
            product.createdAt,
            product.updatedAt,
        );
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        const product = await this.getProductById(id); // Fetch the product with existing relationships

        // Update product fields
        Object.assign(product, updateProductDto);

        // Handle category relationship explicitly
        if (updateProductDto.categoryId) {
            const category = { id: updateProductDto.categoryId }; // Define the category reference
            product.category_id = category as any; // Assign the category relationship
        }

        const updatedProduct = await this.productRepository.save(product); // Save the updated product

        return new ProductResponseDto(
            updatedProduct.id,
            updatedProduct.name,
            updatedProduct.sku,
            updatedProduct.description,
            updatedProduct.weight,
            updatedProduct.width,
            updatedProduct.length,
            updatedProduct.height,
            updatedProduct.image,
            updatedProduct.price,
            updatedProduct.category?.id,
            updatedProduct.category,
            updatedProduct.createdAt,
            updatedProduct.updatedAt,
        );
    }


    async deleteProduct(id: number): Promise<void> {
        const product = await this.productRepository.findOneByOrFail({
            id: id,
            deletedAt: IsNull()
        })
        if (!product) {
            throw new NotFoundException(`Category with ID '${id}' not found`);
        }

        // Perform soft delete by setting deleted_at
        product.deletedAt = new Date();
        await this.productRepository.save(product);
    }
}
