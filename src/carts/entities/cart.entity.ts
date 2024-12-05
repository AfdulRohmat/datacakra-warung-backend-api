import { Product } from 'src/products/enitities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    DeleteDateColumn
} from 'typeorm';

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'product_id' }) // Foreign key column for Product
    product: Product;

    @Column({ type: 'int' })
    quantity: number; // Quantity of the product in the cart

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
