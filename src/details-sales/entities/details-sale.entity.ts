import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Sale } from "src/sales/entities/sale.entity";
import { Product } from "src/products/entities/product.entity";

@Entity('details-sale')
export class DetailsSale {
    @PrimaryGeneratedColumn()
    id: number;

    @RelationId((detailsSale: DetailsSale)=> detailsSale.sales)
    saleId: number;

    @RelationId((detailsSale: DetailsSale)=> detailsSale.products)
    productId: number;

    @ManyToOne(()=> Sale)
    sales: Sale;

    @ManyToOne(()=> Product)
    products: Product;

    @Column()
    quantity: number

    @Column({ type: 'decimal', scale: 2, precision: 10, default: 0.0 })
    total: number;

    @Column({ default: true })
    isActive: boolean;
}
