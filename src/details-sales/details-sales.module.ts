import { Module } from '@nestjs/common';
import { DetailsSalesService } from './details-sales.service';
import { DetailsSalesController } from './details-sales.controller';
import { DetailsSale } from './entities/details-sale.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Product } from 'src/products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DetailsSale, Sale, Product])],
  controllers: [DetailsSalesController],
  providers: [DetailsSalesService],
})
export class DetailsSalesModule {}
