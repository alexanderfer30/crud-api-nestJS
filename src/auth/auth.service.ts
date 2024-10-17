import { Injectable, HttpStatus } from "@nestjs/common";
import { LoginAuthDTO } from "./dto/auth-login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import {JwtService} from '@nestjs/jwt';


@Injectable()
export class AuthService{
   constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private jwtService: JwtService,
   ){}

   async login ({email, password}: LoginAuthDTO){
    const user = await this.userRepository.findOne({
      relations: {role:true},
      where:{
        email,
        isActive: true,
      },
    });

    if(!user || !user.checkPassword(password)){
      return {
        message: "No se encontro el usuario",
        ok: false,
        status: HttpStatus.NOT_FOUND
      }
    }

    user.password=undefined;

    const payload = {
      _sub: user.id,
      _name: user.name,
      _rol: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {ok: true, token, user, status: HttpStatus.OK};
  }
}