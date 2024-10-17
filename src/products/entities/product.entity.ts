import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('product')
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    stock: number;

    @Column()
    unitCost: number;

    @Column({ type: 'decimal', scale: 2, precision: 10, default: 0.0})
    price: number;

    @Column({default: true})
    isActive: boolean;
}
