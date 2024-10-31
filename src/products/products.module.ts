import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { SalesModule } from 'src/sales/sales.module';
import { Sale } from 'src/sales/entities/sale.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Product, Sale])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
