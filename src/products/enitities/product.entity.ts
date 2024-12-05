import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn, JoinColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    sku: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int', nullable: true })
    weight: number;

    @Column({ type: 'int', nullable: true })
    width: number;

    @Column({ type: 'int', nullable: true })
    length: number;

    @Column({ type: 'int', nullable: true })
    height: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    image: string;

    @Column({ type: 'int' })
    price: number;

    @ManyToOne(() => Category, (category) => category.products, { nullable: false, eager: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
