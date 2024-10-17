import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsNumber()
    stock: number;

    @IsNumber()
    unitCost: number;

    @IsNumber()
    price: number;
}
