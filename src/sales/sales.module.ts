import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { DetailsSale } from 'src/details-sales/entities/details-sale.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Sale, User, Product, DetailsSale])],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {}
