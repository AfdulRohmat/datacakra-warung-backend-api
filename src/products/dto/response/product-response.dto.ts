import { CategoryResponseDto } from "src/categories/dto/response/category-response.dto";

export class ProductResponseDto {
    id: number;
    name: string;
    sku: string;
    description?: string;
    weight?: number;
    width?: number;
    length?: number;
    height?: number;
    image?: string;
    price: number;
    category_id: number;
    category: CategoryResponseDto;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        name: string,
        sku: string,
        description: string,
        weight: number,
        width: number,
        length: number,
        height: number,
        image: string,
        price: number,
        category_id: number,
        category: CategoryResponseDto,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.description = description;
        this.weight = weight;
        this.width = width;
        this.length = length;
        this.height = height;
        this.image = image;
        this.price = price;
        this.category_id = category_id;
        this.category = category
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
