import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column({ unique: true })
    @IsEmail({}, { message: "Invalid Email" })
    email: string

    @Column()
    password: string

    @Column({ name: "is_verified", default: false })
    isVerified: boolean

    @Column({
        name: "activation_code",
        default: null
    })
    activationCode: number

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({
        name: "users_roles",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        }
    })
    roles: Role[];

    @CreateDateColumn({ name: "created_at", type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
