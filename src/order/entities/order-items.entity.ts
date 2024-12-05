import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/enitities/product.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.items, { nullable: false })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'int' })
    price: number;

    @CreateDateColumn({ name: "created_at", type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
