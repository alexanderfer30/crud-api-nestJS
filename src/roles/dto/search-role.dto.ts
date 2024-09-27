import {IsInt, IsOptional, IsString, Min} from "class-validator";
export class SearchURoleDto{

    @IsOptional()
    @IsString()
    name: string ='';

    @IsInt()
    @Min(1)
    page: number = 1;

    @IsInt()
    @Min(1)
    limit: number = 10;
}