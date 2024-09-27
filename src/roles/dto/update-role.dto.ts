import { IsNotEmpty, IsString } from "class-validator";
import { CreateRoleDto } from "./create-role.dto";

export class UpdateRoleDto extends CreateRoleDto{
    @IsString()
    @IsNotEmpty()
    age: string;
}