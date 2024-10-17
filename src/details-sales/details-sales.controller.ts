import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetailsSalesService } from './details-sales.service';
import { CreateDetailsSaleDto } from './dto/create-details-sale.dto';
import { UpdateDetailsSaleDto } from './dto/update-details-sale.dto';

@Controller('details-sales')
export class DetailsSalesController {
  constructor(private readonly detailsSalesService: DetailsSalesService) {}

  @Post()
  create(@Body() createDetailsSaleDto: CreateDetailsSaleDto) {
    return this.detailsSalesService.create(createDetailsSaleDto);
  }

  @Get()
  findAll() {
    return this.detailsSalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailsSalesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetailsSaleDto: UpdateDetailsSaleDto) {
    return this.detailsSalesService.update(+id, updateDetailsSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailsSalesService.remove(+id);
  }
}
