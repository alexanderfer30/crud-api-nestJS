import { DetailsSale } from "src/details-sales/entities/details-sale.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId} from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity('sale')
export class Sale {
    
@PrimaryGeneratedColumn()
id: number;

@Column({ type: 'decimal', scale: 2, precision: 10, default: 0.0 })
total: number;

@OneToMany(() => DetailsSale, (detailsSale)=>detailsSale.sales)
detailsSale: DetailsSale[];

@ManyToOne(() => User)
user: User;

@RelationId((sale: Sale) => sale.user)
userId: number;

@Column({ type: 'date' })
date: Date

@Column({ type: 'time' })
time: Date

@Column({ default: true })
isActive: boolean;
}
