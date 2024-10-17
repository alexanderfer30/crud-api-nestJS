import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
  @InjectRepository(User) private readonly userRepository: Repository<User>,
  @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) { }


  async create(createUserDto: CreateUserDto) {
    try {
      const rol = await this.userRepository.findOne({
        where: {isActive: true, id:createUserDto.roleId},
      })
      if(!rol) return {
        ok: false,
        message: 'No existe el rol',
        status: 404,
    };

      const user = this.userRepository.create({
        ...createUserDto,
        role: rol
      })

      // user.email = createUserDto.email
      // user.password = createUserDto.password
      // user.role = rol
      
    await this.userRepository.save(user);

      return {
          ok: true,
          message: 'Usuario creado correctamente',
          status: 201,
      };
  } catch (error) {
      return {
          ok: false,
          message: 'Ocurrio un error al guardar el usuario',
          status: 500,
      };
  }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        relations:{role:true}, //para traer todas las propiedades de rol
        select: {role:{name:true}} //select para trar una propiedad especifica de rol 
      });

      if (users.length > 0) {
        return { ok: true, users, status: 200 };
      }

      return { ok: false, message: 'No se encontraron usuarios', status: 404 };
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrió un error al obtener los usuarios',
        status: 500,
      };
    }
}



async findOne(id: number) {
  try {
    const user = await this.userRepository.findOne({ where: { id}
   });
    if (!user) {
        return { ok: false, message: 'Usuario no encontrado,', status: 404 };
    }

    return { ok: true, user, status: 200 };
} catch (error) {
    return { ok: false, message: 'Ocurrio un error', status: 500 };
}
}

async update(id: number, updateUserDto: UpdateUserDto) {
  try {
    const user = await this.userRepository.findOne({
        where: {id}});

        user.email=updateUserDto.email;
        user.password=updateUserDto.password;
        await this.userRepository.save(user);

        return{
            ok:true,
            message: "Usuario actuailizado correctamente",
            status:200,
        };
} catch (error) {
    return {ok: false, message: "Ocurrio un error", status: 500};
}
}

async remove(id: number) {
 try {
  const user = await this.userRepository.findOne({
    where: {id}
  });
  if (!user) {
    return { ok: false, message: 'Usuario no encontrado,', status: 404 };
};
 await this.userRepository.remove(user);
 return { ok: true, message: 'Usuario borrado', status: 200 };

 } catch (error) {
  return {ok: false, message: "Ocurrio un error", status: 500};
 }
}
}
