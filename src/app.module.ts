import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { IsUniqueConstraint } from './utils/validation/is-unique-constraint';
import { Role } from './users/entities/role.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './email/email.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { Product } from './products/enitities/product.entity';
import { Category } from './categories/entities/category.entity';
import { CartsModule } from './carts/carts.module';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-items.entity';
import { CartItem } from './carts/entities/cart.entity';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forFeature([
      User,
      Role,
      Product,
      Category,
      Order,
      OrderItem,
      CartItem
    ]),
    DatabaseModule,
    UsersModule,
    AuthModule,
    EmailModule,
    ProductsModule,
    CategoriesModule,
    CartsModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule { }
