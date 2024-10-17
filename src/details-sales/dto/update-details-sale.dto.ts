import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailsSaleDto } from './create-details-sale.dto';

export class UpdateDetailsSaleDto extends PartialType(CreateDetailsSaleDto) {}
