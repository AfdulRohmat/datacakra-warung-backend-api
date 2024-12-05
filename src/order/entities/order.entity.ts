import { User } from 'src/users/entities/user.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    DeleteDateColumn,
    JoinColumn
} from 'typeorm';
import { OrderItem } from './order-items.entity';
import { StatusOrderEnum } from '../enums/status-order.enum';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' }) // Foreign key column for User
    user: User;

    @Column({
        name: 'total_price',
        type: 'int'
    })
    totalPrice: number; // Total price of the order

    @Column({ type: 'enum', enum: StatusOrderEnum, default: StatusOrderEnum.PENDING })
    status: StatusOrderEnum; // Status of the order (e.g., PENDING, PAID)

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[]; // Order items linked to this order

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
