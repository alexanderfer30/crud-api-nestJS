import { IsInt, IsOptional, Min } from "class-validator";

export class SaleSearchDto{


    @IsInt()
    @Min(1)
    page: number = 1;

    @IsInt()
    @Min(1)
    limit: number = 5;
}