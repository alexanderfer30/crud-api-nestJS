import { IsArray, IsNumber, IsObject, IsString } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/user/entities/user.entity";


export class CreateSaleDto {
    @IsArray()
    products: Products[]

    @IsNumber()
    userId: number;
}

export class Products {

    @IsNumber()
    id: number

    @IsNumber()
    quantity: number
}