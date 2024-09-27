import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { SearchURoleDto } from "./dto/search-role.dto";
import { Like } from 'typeorm';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) { }

    async create(createRoleDto: CreateRoleDto) {
        try {
           
           
            const role = new Role()
            role.name = createRoleDto.name 
           
           await this.roleRepository.save(role);

            return {
                ok: true,
                message: 'Rol creado correctamente',
                status: 201,
            };
        } catch (error) {
            return {
                ok: false,
                message: 'Ocurrio un error al guardar el rol',
                status: 500,
            };
        }
    }

    async findAll() {
        try {
            const roles = await this.roleRepository.find({
                where: { isActive: true },
            });

            if (roles.length > 0) {
                return { ok: true, roles, status: 200 };
            }

            return { ok: false, message: 'No se encontraron roles', status: 404 };
        } catch (error) {
            return {
                ok: false,
                message: 'Ocurrio un error al obtener los roles',
                status: 500,
            };
        }
    }

    async findOne(id: number) {
        try {
            const rol = await this.roleRepository.findOne({ where: { id } });
            if (!rol) {
                return { ok: false, message: 'Rol no encontrado,', status: 404 };
            }

            return { ok: true, rol, status: 200 };
        } catch (error) {
            return { ok: false, message: 'Ocurrio un error', status: 500 };
        }
    }


    async update(id: number, updateRoleDto: UpdateRoleDto) {
        try {
            const rol = await this.roleRepository.findOne({
                where: {id}});

                rol.name=updateRoleDto.name;
                await this.roleRepository.save(rol);

                return{
                    ok:true,
                    message: "Rol actuailizado correctamente",
                    status:200,
                };
        } catch (error) {
            return {ok: false, message: "Ocurrio un error", status: 500};
        }
    }

    async remove(id: number) { 
        try {
            const rol = await this.roleRepository.findOne({where: {id}});
            rol.isActive=false;

            await this.roleRepository.save(rol);
            return {
                ok: true,
                message: 'Rol eliminado correctamente',
                status: 200,
            };
        } catch (error) {
            return {
                ok:false,
                message: 'Ocurrio un error al eliminar el rol',
                status: 500,
            };
        }
    }

        async Paginado({name, limit, page }: SearchURoleDto): Promise<object> {
            try {
              const [roles, total] = await this.roleRepository.findAndCount({
                where: {
                    name: name ? Like(`%${name}%`) : undefined,
                    isActive: true,
                },
                order: { id: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
              });
          
              if (roles.length > 0) {
                // Calcular el total de páginas
                /* let totalPag: number = Math.ceil(total / limit);*/
                /*let totalPag: number = limit > 0 ? Math.ceil(total / limit) : 0;
                let nextPag: number = page >= totalPag ? page : page + 1;
                let prevPag: number = page <= 1 ? page : page - 1;*/
                
                let totalPag: number = limit > 0 ? Math.ceil(total / limit) : 0;
                let currentPage: number = Number(page);  // Asegurarse de que page es un número
                let nextPag: number = currentPage >= totalPag ? currentPage : currentPage + 1;
                let prevPag: number = currentPage <= 1 ? currentPage : currentPage - 1;
          
                return {
                  ok: true,
                  roles,
                  total,
                  totalPag,
                  currentPage,
                  nextPag,
                  prevPag,
                  status: HttpStatus.OK,
                };
              }
          
              return {
                ok: false,
                message: "Roles not found",
                status: HttpStatus.NOT_FOUND,
              };
            } catch (error) {
              throw new InternalServerErrorException(
                'Ocurrió un error al obtener los roles.',
                error,
              );
            }
          }
    }
