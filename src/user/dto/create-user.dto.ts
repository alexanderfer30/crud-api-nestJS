import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsInt()
    roleId: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}

 