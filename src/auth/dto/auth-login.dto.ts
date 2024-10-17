import { IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDTO{
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
