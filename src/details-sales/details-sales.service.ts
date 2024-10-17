import { Injectable } from '@nestjs/common';
import { CreateDetailsSaleDto } from './dto/create-details-sale.dto';
import { UpdateDetailsSaleDto } from './dto/update-details-sale.dto';

@Injectable()
export class DetailsSalesService {
  create(createDetailsSaleDto: CreateDetailsSaleDto) {
    return 'This action adds a new detailsSale';
  }

  findAll() {
    return `This action returns all detailsSales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detailsSale`;
  }

  update(id: number, updateDetailsSaleDto: UpdateDetailsSaleDto) {
    return `This action updates a #${id} detailsSale`;
  }

  remove(id: number) {
    return `This action removes a #${id} detailsSale`;
  }
}
