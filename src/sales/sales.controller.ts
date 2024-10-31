import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleSearchDto } from './dto/search-sale.dto';
import { query } from 'express';
import { DateDto } from './dto/date-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.createWithTransactions(createSaleDto);
  }

  @Get()
  findAll(@Query() SaleSearchDto: SaleSearchDto) {
    return this.salesService.findAll(SaleSearchDto);
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.salesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
  //   return this.salesService.update(+id, updateSaleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.salesService.remove(+id);
  // }

  @Get('report') 
  report() {
    return this.salesService.report();
  }

  @Get('reporte') 
  ReporteVentas(@Query()params: DateDto) {
    return this.salesService.ReporteVentas(params);
  }

  @Get('portero') 
  portero() {
    return this.salesService.portero();
  }

  @Get('ventas')
  a(@Query()params: DateDto){
    return this.salesService.ReporteVentas(params)
  }

  @Get('listado')
  listado(@Query()params: DateDto){
    return this.salesService.listado(params)
  }
}
