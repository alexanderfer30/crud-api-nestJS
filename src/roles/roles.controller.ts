import { Body, Controller, Post, Get, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SearchURoleDto } from './dto/search-role.dto';
import { jwtAuthGuard } from 'src/auth/jwt.auth.guard';


@UseGuards(jwtAuthGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService){}

    @Post()
    create(@Body() createRoleDto: CreateRoleDto){
        return this.rolesService.create(createRoleDto);
    }

    @Get('all')
    findAll(){
        return this.rolesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:number){
        return this.rolesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete('id')
        remove(@Param('id') id:number){
            return this.rolesService.remove(id);
    }

    @Get()
        paginado(@Query() searchRoleDto: SearchURoleDto) {
      return this.rolesService.Paginado(searchRoleDto);
    }
}

