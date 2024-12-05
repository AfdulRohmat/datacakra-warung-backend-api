import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/request/create-category-request.dto';
import { CategoryResponseDto } from './dto/response/category-response.dto';
import { UpdateCategoryDto } from './dto/request/update-category-request.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async createBulkCategories(createCategoriesDto: CreateCategoryDto[]): Promise<CategoryResponseDto[]> {
        const categories = createCategoriesDto.map((dto) =>
            this.categoryRepository.create({
                name: dto.name,
                description: dto.description,
            }),
        );

        const savedCategories = await this.categoryRepository.save(categories);

        return savedCategories.map(
            (category) =>
                new CategoryResponseDto(
                    category.id,
                    category.name,
                    category.description,
                    category.createdAt,
                    category.updatedAt,
                ),
        );
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
        const { name, description } = createCategoryDto;

        const existingCategory = await this.categoryRepository.findOne({
            where: {
                name: name
            },
            withDeleted: true
        });
        if (existingCategory) {
            if (existingCategory.deletedAt) {
                // Restore the soft-deleted category
                existingCategory.deletedAt = null;
                existingCategory.description = description ?? ""; // Update description if needed
                const restoredCategory = await this.categoryRepository.save(existingCategory);

                return new CategoryResponseDto(
                    restoredCategory.id,
                    restoredCategory.name,
                    restoredCategory.description,
                    restoredCategory.createdAt,
                    restoredCategory.updatedAt,
                );
            }

            throw new BadRequestException(`Category with name '${name}' already exists`);
        }

        // Create a new category
        const category = this.categoryRepository.create({ name, description });
        const savedCategory = await this.categoryRepository.save(category);

        return new CategoryResponseDto(
            savedCategory.id,
            savedCategory.name,
            savedCategory.description,
            savedCategory.createdAt,
            savedCategory.updatedAt,
        );
    }

    async getAllCategories(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoryRepository.find({
            where: {
                deletedAt: IsNull()
            },
        });
        return categories.map(
            (category) =>
                new CategoryResponseDto(
                    category.id,
                    category.name,
                    category.description,
                    category.createdAt,
                    category.updatedAt,
                ),
        );
    }

    async getCategoryById(id: number): Promise<CategoryResponseDto> {
        const category = await this.categoryRepository.findOneByOrFail({
            id: id,
            deletedAt: IsNull()
        });
        if (!category) {
            throw new NotFoundException(`Category with ID '${id}' not found`);
        }
        return new CategoryResponseDto(
            category.id,
            category.name,
            category.description,
            category.createdAt,
            category.updatedAt,
        );
    }

    async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        const category = await this.getCategoryById(id);
        category.name = updateCategoryDto.name;
        category.description = updateCategoryDto.description;

        const updatedCategory = await this.categoryRepository.save(category);
        return new CategoryResponseDto(
            updatedCategory.id,
            updatedCategory.name,
            updatedCategory.description,
            updatedCategory.createdAt,
            updatedCategory.updatedAt,
        );
    }

    async deleteCategory(id: number): Promise<void> {
        const category = await this.categoryRepository.findOneByOrFail({
            id: id,
            deletedAt: IsNull()
        });
        if (!category) {
            throw new NotFoundException(`Category with ID '${id}' not found`);
        }

        // Perform soft delete by setting deleted_at
        category.deletedAt = new Date();
        await this.categoryRepository.save(category);
    }


}
